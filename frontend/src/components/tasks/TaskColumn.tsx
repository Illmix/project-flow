import { Task } from '../../types/graphql';
import TaskCard from './TaskCard';
import {ReactNode} from "react";

type TaskColumnProps = {
    title: string;
    tasks: Task[];
    icon: ReactNode;
};

const TaskColumn = ({ title, tasks, icon }: TaskColumnProps) => {
    return (
        <div className="bg-slate-800/80 rounded-lg p-3 min-h-120 min-w-60 max-w-95 flex-1">
            <header className="border-b flex gap-2 justify-center border-slate-700">
                <h3 className="text-md font-semibold text-slate-300 mb-3">{title}</h3>
                {icon}
            </header>
            <div className="space-y-3 mt-3">
                {tasks.map(task => (
                    <TaskCard key={task.publicId} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TaskColumn;