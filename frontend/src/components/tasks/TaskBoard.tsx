import {useMemo, useState} from 'react';
import TaskColumn from './TaskColumn';
import {Task, TaskStatus} from "../../types/graphql.ts";
import {Ban, CheckCircle2, Hourglass, Layers} from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import TaskCard from "./TaskCard.tsx";

type TaskBoardProps = {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
};

const TaskBoard = ({
                       tasks,
                       onEditTask,
                       onDeleteTask,
                       onTaskStatusChange
}: TaskBoardProps) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Grouped tasks by their status
    const groupedTasks = useMemo(() => {
        const groups: Record<TaskStatus, Task[]> = {
            [TaskStatus.New]: [],
            [TaskStatus.InProgress]: [],
            [TaskStatus.Done]: [],
            [TaskStatus.Canceled]: [],
        };
        tasks.forEach(task => {
            groups[task.Status].push(task);
        });
        return groups;
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.publicId === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const taskId = active.id as string;
            const newStatus = over.id as TaskStatus;

            // Check if the status is a valid TaskStatus to prevent errors
            const isValidStatus = Object.values(TaskStatus).includes(newStatus);
            if (isValidStatus) {
                onTaskStatusChange(taskId, newStatus);
            }
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex justify-between gap-6 overflow-x-auto p-2">
                <TaskColumn
                    id={TaskStatus.New}
                    icon={<Layers size={20} />}
                    title="Backlog"
                    tasks={groupedTasks.new}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                />
                <TaskColumn
                    id={TaskStatus.InProgress}
                    icon={<Hourglass size={20} />}
                    title="In Progress"
                    tasks={groupedTasks.in_progress}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                />
                <TaskColumn
                    id={TaskStatus.Done}
                    icon={<CheckCircle2 size={20} />}
                    title="Done"
                    tasks={groupedTasks.done}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                />
                <TaskColumn
                    id={TaskStatus.Canceled}
                    icon={<Ban size={20} />}
                    title="Canceled"
                    tasks={groupedTasks.canceled}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                />
            </div>
            {/* DragOverlay provides a smooth visual wrapper for the item being dragged */}
            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} onEditClick={() => {}} onDeleteClick={() => {}} />
                    : null}
            </DragOverlay>
        </DndContext>
    );
};

export default TaskBoard;