import { gql } from '@apollo/client';

export const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            publicId
            Name
            Description
            Status
        }
    }
`;

export const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($publicId: String!, $input: UpdateTaskInput!) {
        updateTask(publicId: $publicId, input: $input) {
            publicId
            Name
            Description
            Status
        }
    }
`;

export const DELETE_TASK_MUTATION = gql`
    mutation DeleteTask($publicId: String!) {
        deleteTask(publicId: $publicId) {
            publicId
        }
    }
`;