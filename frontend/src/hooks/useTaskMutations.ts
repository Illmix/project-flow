import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { CREATE_TASK_MUTATION } from '../graphql/mutations/taskMutations';
import {
    CreateTaskMutation,
    CreateTaskMutationVariables,
    Task
} from '../types/graphql';

// The shape of the onCompleted callbacks
// They mirror the pattern used in useSkillMutations
// and allow callers to react to successful operations.

type CreateTaskOnCompleted = (task: Task) => void;

export const useTaskMutations = () => {
    const [createTaskMutation, { loading: createLoading }] = useMutation<
        CreateTaskMutation,
        CreateTaskMutationVariables
    >(CREATE_TASK_MUTATION, {
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

    return {
        createTask,
        loading: createLoading,
    };
};