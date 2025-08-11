import { Task } from '../../types/graphql';
import TaskCard from './TaskCard';

type TaskColumnProps = {
    title: string;
    tasks: Task[];
};

const TaskColumn = ({ title, tasks }: TaskColumnProps) => {
    return (
        <div className="bg-slate-800/80 rounded-lg p-3 w-72 flex-shrink-0">
            <h3 className="text-md font-semibold text-slate-300 px-1 mb-4">{title}</h3>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard key={task.publicId} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TaskColumn;