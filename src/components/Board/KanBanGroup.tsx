import { useDraggable, useDroppable } from '@dnd-kit/core';

interface KanBanGroupProps extends React.PropsWithChildren {
    title: string;
    groupId: string;
}

export const KanBanGroup = ({ title, groupId, children }: KanBanGroupProps) => {
    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
        transform,
        isDragging
    } = useDraggable({
        id: `group-${groupId}`,
        data: {
            type: 'kanban-group',
            groupId
        }
    });

    const { setNodeRef: setDropRef } = useDroppable({
        id: groupId,
        data: {
            type: 'kanban-group',
            groupId
        }
    });

    const setNodeRef = (node: HTMLDivElement | null) => {
        setDragRef(node);
        setDropRef(node);
    };

    const style: React.CSSProperties = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="flex flex-col">
            <div
                {...attributes}
                {...listeners}
                className="mb-2 w-[260px] cursor-grab rounded-md bg-fuchsia-200 px-2 py-1 font-medium active:cursor-grabbing"
            >
                {title}
            </div>
            {children}
        </div>
    );
};
