import { useKanBan } from "@/stores/useKanBan";
import { Button } from "@/components/ui/button";

export const Board = () => {
    const { borads, createBoard } = useKanBan();
  return <div className="flex flex-col gap-4 bg-red-500">{
    borads.map((board) => (
        <div key={board.id}>{board.name}</div>
    ))}
    <Button onClick={() => createBoard({ id: `{Board.length + 1}`, name: 'Board 1' })}>Create Board</Button>
    </div>
}