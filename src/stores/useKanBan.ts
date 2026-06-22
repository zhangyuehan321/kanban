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
}>((set) => ({ 
    boards: [],
    createBoard: (board: Board) => {
        set((state) => ({
            boards: [...state.boards, board],
        }));
    },
}));