import { gql } from '@apollo/client';

export const DELETE_PROJECT_MUTATION = gql`
    mutation DeleteProject($publicId: String!) {
        deleteProject(publicId: $publicId) {
            publicId # Return the ID of the deleted project for cache updates
        }
    }
`;