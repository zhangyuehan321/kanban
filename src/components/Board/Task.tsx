interface TaskProps {   
    title: string;
}

export const Task = ({ title }: TaskProps) => {
    return (
        <div className="p-2 mb-1 rounded-md bg-white border-gray-100">
            {title}
        </div>
    )
}