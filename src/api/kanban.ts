import type { Board, Task } from "@/types/kanban";

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
  getBoards: () => request<Board[]>("/api/boards"),

  createBoard: (groupName: string) =>
    request<Board>("/api/boards", {
      method: "POST",
      body: JSON.stringify({ groupName }),
    }),

  createTask: (groupId: string, title?: string) =>
    request<Task>(`/api/boards/${groupId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  moveTask: (taskId: string, fromGroupId: string, toGroupId: string) =>
    request<Board[]>("/api/tasks/move", {
      method: "PATCH",
      body: JSON.stringify({ taskId, fromGroupId, toGroupId }),
    }),

  reorderTask: (groupId: string, activeTaskId: string, overTaskId?: string) =>
    request<Board[]>("/api/tasks/reorder", {
      method: "PATCH",
      body: JSON.stringify({ groupId, activeTaskId, overTaskId }),
    }),

  reorderGroups: (activeGroupId: string, overGroupId: string) =>
    request<Board[]>("/api/boards/reorder", {
      method: "PATCH",
      body: JSON.stringify({ activeGroupId, overGroupId }),
    }),
};
