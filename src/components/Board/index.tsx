import { useKanBan } from "@/stores/useKanBan";
import { Task } from "./Task";
import { DndContext } from "@dnd-kit/core";

export const Board = () => {
    const { boards } = useKanBan();
    return (
        <DndContext>
            <div className="flex flex-row">
                {boards.map((board) => (
                    <div className="flex flex-row" key={board.id}>
                        <div className="kanban-group p-2 mr-1 min-h-48 w-[260px] rounded-xl bg-fuchsia-100 p-4">
                            <div className="flex flex-col">
                                <div className="w-fit rounded-full bg-fuchsia-300 px-1 mb-2">
                                    未开始
                                </div>
                                <div>
                                    {[0,1,2].map((item) => (
                                        <Task key={item} title={`任务${item}`} />
                                    ))} 
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DndContext>

    )
}