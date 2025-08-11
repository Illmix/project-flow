import { useMemo } from 'react';
import TaskColumn from './TaskColumn';
import {Task, TaskStatus} from "../../types/graphql.ts";

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
        <div className="flex gap-6 overflow-x-auto p-2">
            <TaskColumn title="Backlog" tasks={groupedTasks.new} />
            <TaskColumn title="In Progress" tasks={groupedTasks.in_progress} />
            <TaskColumn title="Done" tasks={groupedTasks.done} />
            <TaskColumn title="Canceled" tasks={groupedTasks.canceled} />
        </div>
    );
};

export default TaskBoard;