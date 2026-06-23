/**
 * 看板状态管理（Zustand）
 * 改造后：读写操作均通过 kanbanApi 调用后端，不再纯前端内存维护
 */
import { create } from 'zustand';
import { kanbanApi } from '@/api/kanban';
import type { Board } from '@/types/kanban';

export const useKanBan = create<{
    boards: Board[];
    loading: boolean;
    error: string | null;
    fetchBoards: () => Promise<void>;
    createBoard: (groupName: string) => Promise<void>;
    createTask: (groupId: string) => Promise<void>;
    moveTask: (
        taskId: string,
        fromGroupId: string,
        toGroupId: string
    ) => Promise<void>;
    reorderTask: (
        groupId: string,
        activeTaskId: string,
        overTaskId?: string
    ) => Promise<void>;
    moveGroup: (activeGroupId: string, overGroupId: string) => Promise<void>;
}>(set => ({
    boards: [],
    loading: false,
    error: null,

    /** 从后端拉取初始看板数据 */
    fetchBoards: async () => {
        set({ loading: true, error: null });
        try {
            const boards = await kanbanApi.getBoards();
            set({ boards, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : '加载看板失败'
            });
        }
    },

    /** 创建分组并同步到后端 */
    createBoard: async groupName => {
        const board = await kanbanApi.createBoard(groupName);
        set(state => ({ boards: [...state.boards, board] }));
    },

    /** 创建任务并同步到后端 */
    createTask: async groupId => {
        const task = await kanbanApi.createTask(groupId);
        set(state => ({
            boards: state.boards.map(board =>
                board.groupId === groupId
                    ? { ...board, tasks: [...board.tasks, task] }
                    : board
            )
        }));
    },

    /** 跨分组移动任务，用后端返回的最新列表更新状态 */
    moveTask: async (taskId, fromGroupId, toGroupId) => {
        const boards = await kanbanApi.moveTask(taskId, fromGroupId, toGroupId);
        set({ boards });
    },

    /** 同分组内排序任务 */
    reorderTask: async (groupId, activeTaskId, overTaskId) => {
        const boards = await kanbanApi.reorderTask(
            groupId,
            activeTaskId,
            overTaskId
        );
        set({ boards });
    },

    /** 调整分组顺序 */
    moveGroup: async (activeGroupId, overGroupId) => {
        const boards = await kanbanApi.reorderGroups(
            activeGroupId,
            overGroupId
        );
        set({ boards });
    }
}));
