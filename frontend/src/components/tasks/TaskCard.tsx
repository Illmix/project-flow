import { Task } from '../../types/graphql';

type TaskCardProps = {
    task: Pick<Task, 'Name'>;
};

const TaskCard = ({ task }: TaskCardProps) => {
    return (
        <div className="bg-slate-700/50 p-3 rounded-md border border-slate-700 shadow-sm">
            <p className="text-sm text-slate-200">{task.Name}</p>
        </div>
    );
};

export default TaskCard;