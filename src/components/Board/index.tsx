import { useKanBan } from "@/stores/useKanBan";
import { Task } from "./Task";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { KanBanGroup } from "./KanBanGroup";

const getGroupIdFromOverId = (overId: string | number) => {
    const id = String(overId);
    return id.includes("-") ? id.split("-")[0] : id;
};

export const Board = () => {
    const { boards, updateBoard, moveTask } = useKanBan();
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const [fromGroupId, taskId] = String(active.id).split("-");
        const toGroupId = getGroupIdFromOverId(over.id);

        if (!fromGroupId || !taskId || fromGroupId === toGroupId) return;

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
                                            <Task key={item.id} title={item.title} id={`${board.groupId}-${item.id}`}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => updateBoard({ ...board, tasks: [...board.tasks, { id: String(board.tasks.length + 1), title: `新任务${board.tasks.length + 1}` }] })}>创建任务</button>
                        </KanBanGroup>
                    </div>
                ))}
                
            </div>
        </DndContext>

    )
}