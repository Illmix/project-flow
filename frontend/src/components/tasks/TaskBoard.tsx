import { useMemo } from 'react';
import TaskColumn from './TaskColumn';
import {Task, TaskStatus} from "../../types/graphql.ts";
import {Ban, CheckCircle2, Hourglass, Layers} from "lucide-react";

type TaskBoardProps = {
    tasks: Task[];
};

const TaskBoard = ({ tasks }: TaskBoardProps) => {
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

    return (
        <div className="flex justify-between gap-10 overflow-x-auto p-2">
            <TaskColumn icon={<Layers className="mt-0.5" size={20}/>} title="Backlog" tasks={groupedTasks.new} />
            <TaskColumn icon={<Hourglass className="mt-0.5" size={20}/>} title="In Progress" tasks={groupedTasks.in_progress} />
            <TaskColumn icon={<CheckCircle2 className="mt-0.5" size={20}/>} title="Done" tasks={groupedTasks.done} />
            <TaskColumn icon={<Ban className="mt-0.5" size={20}/>} title="Canceled" tasks={groupedTasks.canceled} />
        </div>
    );
};

export default TaskBoard;