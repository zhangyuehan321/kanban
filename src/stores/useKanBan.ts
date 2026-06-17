import { create } from "zustand";

interface Board {
    id: string;
    name: string;
}
//集中状态管理
export const useKanBan = create<{
    borads: Board[];
    createBoard: (board: Board) => void;
}>((set) => ({ 
    borads: [],
    createBoard: (board: Board) => {
        set((state) => ({
            borads: [...state.borads, board],
        }));
    },
}));