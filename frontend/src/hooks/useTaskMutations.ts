import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../graphql/mutations/taskMutations';
import {
    CreateTaskMutation,
    CreateTaskMutationVariables,
    UpdateTaskMutation,
    UpdateTaskMutationVariables,
    DeleteTaskMutation,
    DeleteTaskMutationVariables,
    Task
} from '../types/graphql';

// The shape of the onCompleted callbacks

type CreateTaskOnCompleted = (task: Task) => void;

type UpdateTaskOnCompleted = (task: Task) => void;

type DeleteTaskOnCompleted = (task: Task) => void;

export const useTaskMutations = () => {
    const [createTaskMutation, { loading: createLoading }] = useMutation<
        CreateTaskMutation,
        CreateTaskMutationVariables
    >(CREATE_TASK_MUTATION, {
        onError: (err) => toast.error(`Error: ${err.message}`),
    });

    const [updateTaskMutation, { loading: updateLoading }] = useMutation<
        UpdateTaskMutation,
        UpdateTaskMutationVariables
    >(UPDATE_TASK_MUTATION, {
        onError: (err) => toast.error(`Error: ${err.message}`),
    });

    const [deleteTaskMutation, { loading: deleteLoading }] = useMutation<
        DeleteTaskMutation,
        DeleteTaskMutationVariables
    >(DELETE_TASK_MUTATION, {
        onError: (err) => toast.error(`Error: ${err.message}`),
    });

    const createTask = (
        variables: CreateTaskMutationVariables,
        onCompleted?: CreateTaskOnCompleted
    ) => {
        createTaskMutation({
            variables,
            onCompleted: (data) => {
                const newTask = data.createTask;
                if (newTask) {
                    toast.success('Task created successfully!');
                    if (onCompleted) onCompleted(newTask as Task);
                }
            },
        });
    };

    const updateTask = (
        variables: UpdateTaskMutationVariables,
        onCompleted?: UpdateTaskOnCompleted
    ) => {
        updateTaskMutation({
            variables,
            onCompleted: (data) => {
                const updatedTask = data.updateTask;
                if (updatedTask) {
                    toast.success('Task updated successfully!');
                    if (onCompleted) onCompleted(updatedTask as Task);
                }
            },
        });
    };

    const deleteTask = (
        variables: DeleteTaskMutationVariables,
        onCompleted?: DeleteTaskOnCompleted
    ) => {
        deleteTaskMutation({
            variables,
            onCompleted: (data) => {
                const removedTask = data.deleteTask;
                if (removedTask) {
                    toast.success('Task deleted successfully!');
                    if (onCompleted) onCompleted(removedTask as Task);
                }
            },
        });
    };

    return {
        createTask,
        updateTask,
        deleteTask,
        loading: createLoading || updateLoading || deleteLoading,
    };
};