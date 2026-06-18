import { useKanBan } from "@/stores/useKanBan";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/Board";

export const BoardPage = () => {
    const { borads, createBoard } = useKanBan();
    // className="flex flex-col gap-4 bg-red-500"
  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      <Button onClick={() => createBoard({ id: String(borads.length + 1), name: `Board ${borads.length + 1}` })}>Create Board</Button>
      {borads.map((board) => (
        <Board key={board.id} board={board} />
      ))}
    </div>
  );
};