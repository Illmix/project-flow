import { gql } from '@apollo/client';

export const CREATE_SKILL_MUTATION = gql`
    mutation CreateSkill($input: CreateSkillInput!) {
        createSkill(input: $input) {
            id
            Name
            tasksCount
        }
    }
`;

export const DELETE_SKILL_MUTATION = gql`
    mutation DeleteSkill($id: Int!) {
        deleteSkill(id: $id) {
            id
        }
    }
`;