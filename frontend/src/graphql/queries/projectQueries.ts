import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
    query GetProjects {
        getProjects {
            publicId
            Name
            Description
            created_at
        }
    }
`;