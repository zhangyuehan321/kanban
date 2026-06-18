import { useDraggable } from "@dnd-kit/core";
interface TaskProps {   
    title: string;
}

export const Task = ({ title }: TaskProps) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: title,
        data: {
            type: 'TASK',//必须要有这个类型
            title,
        },
    });
    return (
        <div
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            className="p-2 mb-1 rounded-md bg-white border-gray-100"
        >
            {title}
        </div>
    )
}