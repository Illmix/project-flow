import { gql } from '@apollo/client';

export const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            publicId
        }
    }
`;