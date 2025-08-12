import { Task } from '../../types/graphql';
import TaskCard from './TaskCard';

type TaskColumnProps = {
    title: string;
    tasks: Task[];
};

const TaskColumn = ({ title, tasks }: TaskColumnProps) => {
    return (
        <div className="bg-slate-800/80 rounded-lg p-3 min-h-120 min-w-60 max-w-95 flex-1">
            <header className="border-b border-slate-700">
                <h3 className="text-md text-center font-semibold text-slate-300 px-1 mb-4">{title}</h3>
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