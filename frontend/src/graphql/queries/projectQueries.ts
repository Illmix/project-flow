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


export const GET_PROJECT_DETAILS_QUERY = gql`
    query GetProjectDetails($publicId: String!) {
        getProject(publicId: $publicId) {
            publicId
            Name
            Description
            created_at
            tasks {
                publicId
                Name
                Status
            }
        }
    }
`;