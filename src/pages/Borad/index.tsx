import { useKanBan } from "@/stores/useKanBan";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/Board";

export const BoardPage = () => {
    const { boards, createBoard } = useKanBan();
    // className="flex flex-col gap-4 bg-red-500"
  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      <Button onClick={() => createBoard({ id: String(boards.length + 1), name: `Board ${boards.length + 1}` })}>Create Board</Button>
        <Board />
    </div>
  );
};