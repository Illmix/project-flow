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
    Task, GetProjectDetailsQuery, GetProjectDetailsQueryVariables
} from '../types/graphql';
import {GET_PROJECT_DETAILS_QUERY} from "../graphql/queries/projectQueries.ts";

// The shape of the onCompleted callbacks

type CreateTaskOnCompleted = (task: Task) => void;

type UpdateTaskOnCompleted = (task: Task) => void;

type UpdateTaskOnError = () => void;

type DeleteTaskOnCompleted = (task: Task) => void;

export const useTaskMutations = (projectPublicId: string) => {
    const [createTaskMutation, { loading: createLoading }] = useMutation<
        CreateTaskMutation,
        CreateTaskMutationVariables
    >(CREATE_TASK_MUTATION, {
        onError: (err) => toast.error(`Error: ${err.message}`),
        update(cache, { data: result }) {
            const newTask = result?.createTask;
            if (!newTask) return;

            const existingDetails = cache.readQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>({
                query: GET_PROJECT_DETAILS_QUERY,
                variables: { publicId: projectPublicId! },
            });

            if (existingDetails?.getProject) {
                cache.writeQuery({
                    query: GET_PROJECT_DETAILS_QUERY,
                    variables: { publicId: projectPublicId! },
                    data: {
                        getProject: {
                            ...existingDetails.getProject,
                            tasks: [...(existingDetails.getProject.tasks || []), newTask],
                        },
                    },
                });
            }
        }
    });

    const [updateTaskMutation, { loading: updateLoading }] = useMutation<
        UpdateTaskMutation,
        UpdateTaskMutationVariables
    >(UPDATE_TASK_MUTATION);

    const [deleteTaskMutation, { loading: deleteLoading }] = useMutation<
        DeleteTaskMutation,
        DeleteTaskMutationVariables
    >(DELETE_TASK_MUTATION, {
        onError: (err) => toast.error(`Error: ${err.message}`),
        update(cache, { data: result }) {
            const deletedTaskId = result?.deleteTask.publicId;
            if (!deletedTaskId) return;

            // Manually update the cache for an instant UI change
            cache.modify({
                id: cache.identify({ __typename: 'Project', publicId: projectPublicId }),
                fields: {
                    tasks(existingTasks = [], { readField }) {
                        return existingTasks.filter(
                            (taskRef: any) => readField('publicId', taskRef) !== deletedTaskId
                        );
                    }
                }
            });
        }
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
        onCompleted?: UpdateTaskOnCompleted,
        onError?: UpdateTaskOnError
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
            onError: (err) => {
                toast.error(`Error: ${err.message}`)
                if (onError) onError()
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