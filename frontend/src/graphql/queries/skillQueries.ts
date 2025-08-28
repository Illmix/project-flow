import { gql } from '@apollo/client';

export const GET_SKILLS_QUERY = gql`
    query GetSkills {
        getSkills {
            id
            Name
            tasksCount
        }
    }
`;