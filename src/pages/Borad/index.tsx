import { useKanBan } from "@/stores/useKanBan";

export const Board = () => {
    const { borads, createBoard } = useKanBan();
  return <div className="flex flex-col gap-4 bg-red-500">{
    borads.map((board) => (
        <div key={board.id}>{board.name}</div>
    ))}
    <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createBoard({ id: `{Board.length + 1}`, name: 'Board 1' })}>Create Board</button>
    </div>
}