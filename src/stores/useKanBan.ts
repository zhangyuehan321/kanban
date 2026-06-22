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
                        return { ...b, tasks: [...b.tasks, task] };
                    }
                    return b;
                }),
            };
        });
    },
}));