import { useKanBan } from "@/stores/useKanBan";

export const Board = () => {
    const { boards } = useKanBan();
    return (
        <div className="flex flex-row">
            {boards.map((board) => (
                <div className="flex flex-row" key={board.id}>
                    <div className="kanban-group min-h-48 w-[260px] rounded-3xl bg-fuchsia-100 p-4">
                        <div className="flex">
                            <div className="rounded-full bg-fuchsia-300 px-1">
                                {[0,1,2].map((item) => (
                                    <div key={item}>
                                        任务{item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* {boards.name} */}
                    </div>
                </div>
            ))}
        </div>

    )
}