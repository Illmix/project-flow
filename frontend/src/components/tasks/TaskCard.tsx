import { Task } from '../../types/graphql';
import { Pencil, Trash2 } from 'lucide-react';
import {MouseEvent} from "react";

type TaskCardProps = {
    task: Task;
    onEditClick: (task: Task) => void;
    onDeleteClick: (task: Task) => void;
};

const TaskCard = ({ task, onEditClick, onDeleteClick }: TaskCardProps) => {
    const onTaskDeleteClick = (e: MouseEvent<HTMLButtonElement>, task: Task) => {
        e.stopPropagation();
        e.preventDefault();
        onDeleteClick(task);
    }
    return (
        <div
            onClick={() => onEditClick(task)}
            className="bg-slate-700/50 p-3 cursor-pointer
            rounded-md border border-slate-700 shadow-sm group relative">
            <p className="text-sm text-slate-200 truncate max-w-[85%]">{task.Name}</p>

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEditClick(task)}
                        className="p-1 text-slate-400 hover:text-indigo-500">
                    <Pencil size={16} />
                </button>
                <button onClick={(e) => onTaskDeleteClick(e, task)}
                        className="p-1 text-slate-400 hover:text-red-400">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;