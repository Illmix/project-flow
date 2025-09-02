import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { UPDATE_PROJECT_MUTATION } from '../graphql/mutations/projectMutations';
import {UpdateProjectMutation, UpdateProjectMutationVariables} from '../types/graphql';

export const useProjectMutations = () => {

    const [updateProject, { loading: updateLoading }] = useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(
        UPDATE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project updated successfully!');
            },
            onError: (err) => toast.error(`Error: ${err.message}`),
        }
    );


    return {
        updateProject,
        loading: updateLoading,
    };
};