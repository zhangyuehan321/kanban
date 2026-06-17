import { useKanBan } from "@/stores/useKanBan";

export const Board = () => {
    const { borads, createBoard } = useKanBan();
  return <div>{
    borads.map((board) => (
        <div key={board.id}>{board.name}</div>
    ))}
    <button onClick={() => createBoard({ id: `{Board.length + 1}`, name: 'Board 1' })}>Create Board</button>
    </div>
}