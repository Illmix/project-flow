import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/graphql';
import {GripVertical, Pencil, Trash2} from 'lucide-react';
import {useDraggable} from "@dnd-kit/core";

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
        isDragging, // Styles for the card while it's being dragged
    } = useDraggable({ id: task.publicId });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0px 5px 15px rgba(0, 0, 0, 0.2)' : 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-slate-700/50 p-3
            rounded-md border border-slate-700 shadow-sm group relative flex items-center gap-2">
            <div
                {...listeners}
                {...attributes}
                className="cursor-grab touch-none text-slate-500 p-1"
            >
                <GripVertical size={18} />
            </div>
            <div
                onClick={() => onEditClick(task)}
                className="cursor-pointer flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{task.Name}</p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEditClick(task)}
                        className="p-1 text-slate-400 hover:text-indigo-500">
                    <Pencil size={16} />
                </button>
                <button onClick={() => onDeleteClick(task)}
                        className="p-1 text-slate-400 hover:text-red-400">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;