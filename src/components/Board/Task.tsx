import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";

interface TaskProps {   
    title: string;
    id: string|number;
}

export const Task = ({ title, id }: TaskProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            type: 'task',//必须要有这个类型
            title,
        },
    });
    const style:React.CSSProperties|undefined = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
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
    )
}