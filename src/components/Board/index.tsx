import { useKanBan } from "@/stores/useKanBan";
import { Task } from "./Task";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { KanBanGroup } from "./KanBanGroup";

export const Board = () => {
    const { boards, createTask, moveTask } = useKanBan();
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type !== "task") return;

        const fromGroupId = activeData.groupId as string;
        const taskId = String(activeData.taskId);

        let toGroupId: string | undefined;
        if (overData?.type === "kanban-group") {
            toGroupId = overData.groupId as string;
        } else if (overData?.type === "task") {
            toGroupId = overData.groupId as string;
        } else {
            toGroupId = String(over.id);
        }

        if (!fromGroupId || !taskId || !toGroupId || fromGroupId === toGroupId) return;

        moveTask(taskId, fromGroupId, toGroupId);
    };
    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-row">
                {boards.map((board) => (
                    <div className="flex flex-row" key={board.groupId}>
                        <KanBanGroup title={board.groupName} groupId={board.groupId}>
                            <div className="kanban-group p-2 mr-1 min-h-48 w-[260px] rounded-xl bg-fuchsia-100 p-4">
                                <div className="flex flex-col">
                                    <div className="w-fit rounded-full bg-fuchsia-300 px-1 mb-2">
                                        未开始
                                    </div>
                                    <div>
                                        {board.tasks.map((item) => (
                                            <Task
                                                key={item.id}
                                                groupId={board.groupId}
                                                taskId={String(item.id)}
                                                title={item.title}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => createTask(board.groupId)}>创建任务</button>
                        </KanBanGroup>
                    </div>
                ))}
                
            </div>
        </DndContext>

    )
}