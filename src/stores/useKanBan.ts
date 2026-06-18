import { create } from "zustand";

interface Board {
    id: string;
    name: string;
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