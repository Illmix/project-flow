import { Task } from '../../types/graphql';
import TaskCard from './TaskCard';
import {ReactNode} from "react";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

type TaskColumnProps = {
    id: string; // The ID is the status of the column
    title: string;
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    icon: ReactNode;
};

const TaskColumn = ({
                        title,
                        tasks,
                        icon,
                        onEditTask,
                        onDeleteTask,
                        id
}: TaskColumnProps) => {
    const { setNodeRef } = useDroppable({ id });
    const taskIds = tasks.map(task => task.publicId);
    return (
        <div ref={setNodeRef} className="bg-slate-800/80 rounded-lg p-3 min-h-120 min-w-60 max-w-95 flex-1">
            <header className="border-b flex gap-2 justify-center border-slate-700">
                <h3 className="text-md font-semibold text-slate-300 mb-3">{title}</h3>
                {icon}
            </header>
            <div className="space-y-3 mt-3">
                <SortableContext id={id} items={taskIds}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.publicId}
                            task={task}
                            onEditClick={onEditTask}
                            onDeleteClick={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default TaskColumn;