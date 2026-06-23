/**
 * 看板 Node.js 后端服务
 * 使用 data.json 作为持久化存储，提供 REST API 供前端调用
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** 看板数据文件路径 */
const DATA_FILE = join(__dirname, 'data.json');
/** 云平台会注入 PORT，本地默认 3001 */
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
/** 允许跨域的前端地址（GitHub Pages / 本地 Vite） */
const ALLOWED_ORIGINS = (
    process.env.ALLOWED_ORIGINS ??
    'http://localhost:5173,https://zhangyuehan321.github.io'
)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

function setCors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/** 从 data.json 读取看板数据 */
function readData() {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

/** 将看板数据写回 data.json */
function writeData(data) {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/** 解析 POST/PATCH 请求体 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}

function sendJson(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
    setCors(req, res);

    // 浏览器跨域预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
    const { pathname } = url;
    const { method } = req;

    try {
        // GET /api/boards — 获取全部分组及任务
        if (method === 'GET' && pathname === '/api/boards') {
            const data = readData();
            return sendJson(res, 200, data.boards);
        }

        // POST /api/boards — 创建新分组
        if (method === 'POST' && pathname === '/api/boards') {
            const body = await parseBody(req);
            const data = readData();
            const board = {
                groupId: randomUUID(),
                groupName: body.groupName || `分组${data.boards.length + 1}`,
                tasks: []
            };
            data.boards.push(board);
            writeData(data);
            return sendJson(res, 201, board);
        }

        // POST /api/boards/:groupId/tasks — 在指定分组下创建任务
        const taskMatch = pathname.match(/^\/api\/boards\/([^/]+)\/tasks$/);
        if (method === 'POST' && taskMatch) {
            const groupId = taskMatch[1];
            const body = await parseBody(req);
            const data = readData();
            const board = data.boards.find(item => item.groupId === groupId);
            if (!board) {
                return sendJson(res, 404, { message: 'Group not found' });
            }

            const task = {
                id: randomUUID(),
                title: body.title || `新任务${board.tasks.length + 1}`
            };
            board.tasks.push(task);
            writeData(data);
            return sendJson(res, 201, task);
        }

        // PATCH /api/tasks/reorder — 同分组内调整任务顺序
        if (method === 'PATCH' && pathname === '/api/tasks/reorder') {
            const body = await parseBody(req);
            const { groupId, activeTaskId, overTaskId } = body;
            const data = readData();
            const board = data.boards.find(item => item.groupId === groupId);

            if (!board) {
                return sendJson(res, 404, { message: 'Group not found' });
            }

            const activeIndex = board.tasks.findIndex(
                task => String(task.id) === String(activeTaskId)
            );
            if (activeIndex === -1) {
                return sendJson(res, 404, { message: 'Task not found' });
            }

            if (overTaskId) {
                const overIndex = board.tasks.findIndex(
                    task => String(task.id) === String(overTaskId)
                );
                if (overIndex === -1) {
                    return sendJson(res, 404, {
                        message: 'Target task not found'
                    });
                }
                if (activeIndex !== overIndex) {
                    const tasks = board.tasks.slice();
                    const [moved] = tasks.splice(activeIndex, 1);
                    tasks.splice(overIndex, 0, moved);
                    board.tasks = tasks;
                }
            } else {
                const [task] = board.tasks.splice(activeIndex, 1);
                board.tasks.push(task);
            }

            writeData(data);
            return sendJson(res, 200, data.boards);
        }

        // PATCH /api/tasks/move — 跨分组移动任务
        if (method === 'PATCH' && pathname === '/api/tasks/move') {
            const body = await parseBody(req);
            const { taskId, fromGroupId, toGroupId } = body;
            const data = readData();
            const fromBoard = data.boards.find(
                item => item.groupId === fromGroupId
            );
            const toBoard = data.boards.find(
                item => item.groupId === toGroupId
            );

            if (!fromBoard || !toBoard) {
                return sendJson(res, 404, { message: 'Group not found' });
            }

            const taskIndex = fromBoard.tasks.findIndex(
                task => String(task.id) === String(taskId)
            );
            if (taskIndex === -1) {
                return sendJson(res, 404, { message: 'Task not found' });
            }

            const [task] = fromBoard.tasks.splice(taskIndex, 1);
            if (
                !toBoard.tasks.some(item => String(item.id) === String(taskId))
            ) {
                toBoard.tasks.push(task);
            }

            writeData(data);
            return sendJson(res, 200, data.boards);
        }

        // PATCH /api/boards/reorder — 调整分组（列）顺序
        if (method === 'PATCH' && pathname === '/api/boards/reorder') {
            const body = await parseBody(req);
            const { activeGroupId, overGroupId } = body;
            const data = readData();
            const fromIndex = data.boards.findIndex(
                item => item.groupId === activeGroupId
            );
            const toIndex = data.boards.findIndex(
                item => item.groupId === overGroupId
            );

            if (fromIndex === -1 || toIndex === -1) {
                return sendJson(res, 404, { message: 'Group not found' });
            }

            const [moved] = data.boards.splice(fromIndex, 1);
            data.boards.splice(toIndex, 0, moved);
            writeData(data);
            return sendJson(res, 200, data.boards);
        }

        return sendJson(res, 404, { message: 'Not found' });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Internal server error';
        return sendJson(res, 500, { message });
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Kanban API server running at http://${HOST}:${PORT}`);
});
