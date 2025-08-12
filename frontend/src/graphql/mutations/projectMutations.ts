import { gql } from '@apollo/client';

export const DELETE_PROJECT_MUTATION = gql`
    mutation DeleteProject($publicId: String!) {
        deleteProject(publicId: $publicId) {
            publicId # Return the ID of the deleted project for cache updates
        }
    }
`;

export const CREATE_PROJECT_MUTATION = gql`
    mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
            publicId
            Name
            Description
            created_at
        }
    }
`;

export const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject($publicId: String!, $input: UpdateProjectInput!) {
        updateProject(publicId: $publicId, input: $input) {
            publicId
            Name
            Description
        }
    }
`;