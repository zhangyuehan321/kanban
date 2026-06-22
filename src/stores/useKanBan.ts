import { create } from "zustand";

type Task = {
    id: string|number;
    title: string;
}

interface Board {
    groupId: string;
    groupName: string;
    tasks: Task[];
}
//集中状态管理
export const useKanBan = create<{
    boards: Board[];
    createBoard: (board: Board) => void;
    updateBoard: (board: Board) => void;
    createTask: (groupId: string) => void;
    moveTask: (taskId: string, fromGroupId: string, toGroupId: string) => void;
}>((set) => ({ 
    boards: [],
    createBoard: (board: Board) => {
        set((state) => ({
            boards: [...state.boards, board],
        }));
    },
    updateBoard: (board: Board) => {
        set((state) => ({
            boards: state.boards.map((b) => b.groupId === board.groupId ? board : b),
        }));
    },
    createTask: (groupId: string) => {
        set((state) => ({
            boards: state.boards.map((b) => {
                if (b.groupId !== groupId) return b;
                const nextIndex = b.tasks.length + 1;
                return {
                    ...b,
                    tasks: [...b.tasks, { id: crypto.randomUUID(), title: `新任务${nextIndex}` }],
                };
            }),
        }));
    },
    moveTask: (taskId: string, fromGroupId: string, toGroupId: string) => {
        set((state) => {
            const fromBoard = state.boards.find((b) => b.groupId === fromGroupId);
            const task = fromBoard?.tasks.find((t) => String(t.id) === taskId);
            if (!task) return state;

            return {
                boards: state.boards.map((b) => {
                    if (b.groupId === fromGroupId) {
                        return { ...b, tasks: b.tasks.filter((t) => String(t.id) !== taskId) };
                    }
                    if (b.groupId === toGroupId) {
                        if (b.tasks.some((t) => String(t.id) === taskId)) return b;
                        return { ...b, tasks: [...b.tasks, task] };
                    }
                    return b;
                }),
            };
        });
    },
}));