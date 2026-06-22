import { useKanBan } from "@/stores/useKanBan";
import { Task } from "./Task";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { KanBanGroup } from "./KanBanGroup";

const getTargetGroupId = (
    overId: string | number,
    overData: { type?: string; groupId?: string } | undefined,
) => {
    if (overData?.type === "kanban-group") {
        return overData.groupId as string;
    }
    if (overData?.type === "task") {
        return overData.groupId as string;
    }
    return String(overId);
};

export const Board = () => {
    const { boards, createTask, moveTask, reorderTask, moveGroup } = useKanBan();

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "kanban-group") {
            const activeGroupId = activeData.groupId as string;
            const overGroupId = getTargetGroupId(over.id, overData);

            if (activeGroupId && overGroupId && activeGroupId !== overGroupId) {
                moveGroup(activeGroupId, overGroupId);
            }
            return;
        }

        if (activeData?.type !== "task") return;

        const fromGroupId = activeData.groupId as string;
        const taskId = String(activeData.taskId);
        const toGroupId = getTargetGroupId(over.id, overData);

        if (!fromGroupId || !taskId || !toGroupId) return;

        if (fromGroupId === toGroupId) {
            if (overData?.type === "task") {
                const overTaskId = String(overData.taskId);
                if (taskId !== overTaskId) {
                    reorderTask(fromGroupId, taskId, overTaskId);
                }
            } else {
                reorderTask(fromGroupId, taskId);
            }
            return;
        }

        moveTask(taskId, fromGroupId, toGroupId);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-row">
                {boards.map((board) => (
                    <KanBanGroup key={board.groupId} title={board.groupName} groupId={board.groupId}>
                        <div className="kanban-group mr-1 min-h-48 w-[260px] rounded-xl bg-fuchsia-100 p-4">
                            <div className="flex flex-col">
                                <div className="mb-2 w-fit rounded-full bg-fuchsia-300 px-1">
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
                ))}
            </div>
        </DndContext>
    );
};
