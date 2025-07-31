import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            token
            employee {
                publicId
                Name
                Email
            }
        }
    }
`;