import { useDroppable } from "@dnd-kit/core";

interface KanBanGroupProps extends React.PropsWithChildren {
    title: string;
    groupId: string;
}   
export const KanBanGroup = ({ groupId, children }: KanBanGroupProps) => {

    const { setNodeRef } = useDroppable({
        id: groupId,
        data: {
            type: 'kanban-group',
        },
    });
    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    )
}