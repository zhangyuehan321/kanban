import { useEffect } from "react";
import { useKanBan } from "@/stores/useKanBan";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/Board";

export const BoardPage = () => {
  const { boards, loading, error, fetchBoards, createBoard } = useKanBan();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="mb-2 text-red-500">{error}</p>
        <Button onClick={() => fetchBoards()}>重试</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      <Button onClick={() => createBoard(`分组${boards.length + 1}`)}>
        创建分组
      </Button>
      <Board />
    </div>
  );
};
