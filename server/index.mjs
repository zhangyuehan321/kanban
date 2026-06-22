import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data.json");
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ??
  "http://localhost:5173,https://zhangyuehan321.github.io"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readData() {
  return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  const { pathname } = url;
  const { method } = req;

  try {
    if (method === "GET" && pathname === "/api/boards") {
      const data = readData();
      return sendJson(res, 200, data.boards);
    }

    if (method === "POST" && pathname === "/api/boards") {
      const body = await parseBody(req);
      const data = readData();
      const board = {
        groupId: randomUUID(),
        groupName: body.groupName || `分组${data.boards.length + 1}`,
        tasks: [],
      };
      data.boards.push(board);
      writeData(data);
      return sendJson(res, 201, board);
    }

    const taskMatch = pathname.match(/^\/api\/boards\/([^/]+)\/tasks$/);
    if (method === "POST" && taskMatch) {
      const groupId = taskMatch[1];
      const body = await parseBody(req);
      const data = readData();
      const board = data.boards.find((item) => item.groupId === groupId);
      if (!board) {
        return sendJson(res, 404, { message: "Group not found" });
      }

      const task = {
        id: randomUUID(),
        title: body.title || `新任务${board.tasks.length + 1}`,
      };
      board.tasks.push(task);
      writeData(data);
      return sendJson(res, 201, task);
    }

    if (method === "PATCH" && pathname === "/api/tasks/reorder") {
      const body = await parseBody(req);
      const { groupId, activeTaskId, overTaskId } = body;
      const data = readData();
      const board = data.boards.find((item) => item.groupId === groupId);

      if (!board) {
        return sendJson(res, 404, { message: "Group not found" });
      }

      const activeIndex = board.tasks.findIndex(
        (task) => String(task.id) === String(activeTaskId),
      );
      if (activeIndex === -1) {
        return sendJson(res, 404, { message: "Task not found" });
      }

      if (overTaskId) {
        const overIndex = board.tasks.findIndex(
          (task) => String(task.id) === String(overTaskId),
        );
        if (overIndex === -1) {
          return sendJson(res, 404, { message: "Target task not found" });
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

    if (method === "PATCH" && pathname === "/api/tasks/move") {
      const body = await parseBody(req);
      const { taskId, fromGroupId, toGroupId } = body;
      const data = readData();
      const fromBoard = data.boards.find((item) => item.groupId === fromGroupId);
      const toBoard = data.boards.find((item) => item.groupId === toGroupId);

      if (!fromBoard || !toBoard) {
        return sendJson(res, 404, { message: "Group not found" });
      }

      const taskIndex = fromBoard.tasks.findIndex(
        (task) => String(task.id) === String(taskId),
      );
      if (taskIndex === -1) {
        return sendJson(res, 404, { message: "Task not found" });
      }

      const [task] = fromBoard.tasks.splice(taskIndex, 1);
      if (!toBoard.tasks.some((item) => String(item.id) === String(taskId))) {
        toBoard.tasks.push(task);
      }

      writeData(data);
      return sendJson(res, 200, data.boards);
    }

    if (method === "PATCH" && pathname === "/api/boards/reorder") {
      const body = await parseBody(req);
      const { activeGroupId, overGroupId } = body;
      const data = readData();
      const fromIndex = data.boards.findIndex(
        (item) => item.groupId === activeGroupId,
      );
      const toIndex = data.boards.findIndex(
        (item) => item.groupId === overGroupId,
      );

      if (fromIndex === -1 || toIndex === -1) {
        return sendJson(res, 404, { message: "Group not found" });
      }

      const [moved] = data.boards.splice(fromIndex, 1);
      data.boards.splice(toIndex, 0, moved);
      writeData(data);
      return sendJson(res, 200, data.boards);
    }

    return sendJson(res, 404, { message: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return sendJson(res, 500, { message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Kanban API server running at http://${HOST}:${PORT}`);
});
