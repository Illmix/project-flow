import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/graphql';
import { Pencil, Trash2 } from 'lucide-react';
import {MouseEvent} from "react";

type TaskCardProps = {
    task: Task;
    onEditClick: (task: Task) => void;
    onDeleteClick: (task: Task) => void;
};

const TaskCard = ({ task, onEditClick, onDeleteClick }: TaskCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging, // Styles for the card while it's being dragged
    } = useSortable({ id: task.publicId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0px 5px 15px rgba(0, 0, 0, 0.2)' : 'none',
    };

    const onTaskDeleteClick = (e: MouseEvent<HTMLButtonElement>, task: Task) => {
        e.stopPropagation();
        e.preventDefault();
        onDeleteClick(task);
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onEditClick(task)}
            {...attributes}
            className="bg-slate-700/50 p-3 cursor-pointer
            rounded-md border border-slate-700 shadow-sm group relative">
            <div {...listeners} className="cursor-grab touch-none">
                <p className="text-sm text-slate-200 truncate max-w-[85%]">{task.Name}</p>
            </div>

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