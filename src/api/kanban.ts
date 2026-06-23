/**
 * 看板后端 API 封装
 * 本地开发：请求 /api/*，由 Vite 代理到 server/index.mjs
 * 线上部署：通过 VITE_API_URL 指向 Render 等平台的 API 地址
 */
import type { Board, Task } from "@/types/kanban";

// 生产环境 API 根地址，未配置时使用相对路径（走本地代理）
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const apiUrl = (path: string) => `${API_BASE}${path}`;

/** 统一 fetch 封装，处理 JSON 与错误 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const kanbanApi = {
  /** 获取全部分组及任务（页面初始加载） */
  getBoards: () => request<Board[]>(apiUrl("/api/boards")),

  /** 创建新分组 */
  createBoard: (groupName: string) =>
    request<Board>(apiUrl("/api/boards"), {
      method: "POST",
      body: JSON.stringify({ groupName }),
    }),

  /** 在指定分组下创建任务 */
  createTask: (groupId: string, title?: string) =>
    request<Task>(apiUrl(`/api/boards/${groupId}/tasks`), {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  /** 跨分组移动任务 */
  moveTask: (taskId: string, fromGroupId: string, toGroupId: string) =>
    request<Board[]>(apiUrl("/api/tasks/move"), {
      method: "PATCH",
      body: JSON.stringify({ taskId, fromGroupId, toGroupId }),
    }),

  /** 同分组内调整任务顺序 */
  reorderTask: (groupId: string, activeTaskId: string, overTaskId?: string) =>
    request<Board[]>(apiUrl("/api/tasks/reorder"), {
      method: "PATCH",
      body: JSON.stringify({ groupId, activeTaskId, overTaskId }),
    }),

  /** 调整分组（列）顺序 */
  reorderGroups: (activeGroupId: string, overGroupId: string) =>
    request<Board[]>(apiUrl("/api/boards/reorder"), {
      method: "PATCH",
      body: JSON.stringify({ activeGroupId, overGroupId }),
    }),
};
