interface BoardProps {
    board: {
        id: string;
        name: string;
    };
}

export const Board = ({ board }: BoardProps) => {
    return <div className="flex flex-row">
        <div className="kanban-group min-h-48 w-[260px] rounded-3xl bg-fuchsia-100 p-4">
            {board.name}
        </div>
    </div>
}