import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GET_PROJECTS_QUERY } from '../graphql/queries/projectQueries';
import { DELETE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION } from '../graphql/mutations/projectMutations';
import {
    DeleteProjectMutation, DeleteProjectMutationVariables,
    GetProjectsQuery,
    UpdateProjectMutation,
    UpdateProjectMutationVariables
} from '../types/graphql';

export const useProjectMutations = () => {
    const navigate = useNavigate();

    const [updateProject, { loading: updateLoading }] = useMutation<UpdateProjectMutation,
        UpdateProjectMutationVariables>(
        UPDATE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project updated successfully!');
            },
            onError: (err) => toast.error(`Error: ${err.message}`),
        }
    );

    const [deleteProject, { loading: deleteLoading }] = useMutation<DeleteProjectMutation,
        DeleteProjectMutationVariables>(
        DELETE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project deleted successfully!');
                navigate('/projects');
            },
            onError: (err) => toast.error(`Error: ${err.message}`),
            update(cache, { data: result }) {
                const deletedProjectId = result?.deleteProject.publicId;
                const existingProjects = cache.readQuery<GetProjectsQuery>({ query: GET_PROJECTS_QUERY });
                if (deletedProjectId && existingProjects) {
                    cache.writeQuery({
                        query: GET_PROJECTS_QUERY,
                        data: {
                            getProjects: existingProjects.getProjects.filter(p => p.publicId !== deletedProjectId)
                        },
                    });
                }
            },
        }
    );

    return {
        updateProject,
        deleteProject,
        loading: updateLoading || deleteLoading,
    };
};