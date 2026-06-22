import { create } from "zustand";
import { kanbanApi } from "@/api/kanban";
import type { Board } from "@/types/kanban";

export const useKanBan = create<{
  boards: Board[];
  loading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  createBoard: (groupName: string) => Promise<void>;
  createTask: (groupId: string) => Promise<void>;
  moveTask: (taskId: string, fromGroupId: string, toGroupId: string) => Promise<void>;
  moveGroup: (activeGroupId: string, overGroupId: string) => Promise<void>;
}>((set) => ({
  boards: [],
  loading: false,
  error: null,

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const boards = await kanbanApi.getBoards();
      set({ boards, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "加载看板失败",
      });
    }
  },

  createBoard: async (groupName) => {
    const board = await kanbanApi.createBoard(groupName);
    set((state) => ({ boards: [...state.boards, board] }));
  },

  createTask: async (groupId) => {
    const task = await kanbanApi.createTask(groupId);
    set((state) => ({
      boards: state.boards.map((board) =>
        board.groupId === groupId
          ? { ...board, tasks: [...board.tasks, task] }
          : board,
      ),
    }));
  },

  moveTask: async (taskId, fromGroupId, toGroupId) => {
    const boards = await kanbanApi.moveTask(taskId, fromGroupId, toGroupId);
    set({ boards });
  },

  moveGroup: async (activeGroupId, overGroupId) => {
    const boards = await kanbanApi.reorderGroups(activeGroupId, overGroupId);
    set({ boards });
  },
}));
