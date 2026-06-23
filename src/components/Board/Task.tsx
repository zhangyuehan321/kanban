import { useDraggable } from '@dnd-kit/core';

interface TaskProps {
    title: string;
    groupId: string;
    taskId: string;
}

export const Task = ({ title, groupId, taskId }: TaskProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: taskId,
        data: {
            type: 'task',
            groupId,
            taskId,
            title
        }
    });
    const style: React.CSSProperties | undefined = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
          }
        : undefined;
    return (
        <div
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            className="p-2 mb-1 rounded-md bg-white border-gray-100"
        >
            {title}
        </div>
    );
};
