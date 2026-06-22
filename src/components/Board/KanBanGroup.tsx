import { useDraggable } from "@dnd-kit/core";

interface KanBanGroupProps extends React.PropsWithChildren {
    title: string;
}   
export const KanBanGroup = ({ title, children }: KanBanGroupProps) => {

    const {setNodeRef } = useDraggable({
        id: 'kanban-group',
        data: {
            type: 'kanban-group',//必须要有这个类型
        },
    });
    return (
        <div ref={setNodeRef}>
            {/* {title} */}
            {children}
        </div>
    )
}