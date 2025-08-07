import {useMutation, useQuery} from '@apollo/client';
import {DeleteProjectMutation, DeleteProjectMutationVariables, GetProjectsQuery} from "../../types/graphql.ts";
import {GET_PROJECTS_QUERY} from "../../graphql/queries/projectQueries.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import ProjectCard from "../../components/projects/ProjectCard.tsx";
import {useState} from "react";
import {DELETE_PROJECT_MUTATION} from "../../graphql/mutations/projectMutations.ts";
import Modal from "../../components/ui/Modal.tsx";
import toast from "react-hot-toast";

const ProjectsPage = () => {
    const { data, loading, error } = useQuery<GetProjectsQuery>(GET_PROJECTS_QUERY);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const [deleteProject, { loading: deleteLoading }] = useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(
        DELETE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project deleted successfully!');
            },
            onError: (error) => {
                toast.error(`${error.message}`);
            },
            // Remove the deleted project from the Apollo cache.
            update(cache, { data: result }) {
                const deletedProjectId = result?.deleteProject.publicId;
                if (!deletedProjectId) return;

                // Read the current list of projects from the cache
                const existingProjects = cache.readQuery<GetProjectsQuery>({ query: GET_PROJECTS_QUERY });
                if (!existingProjects) return;

                // Write the new list back to the cache, filtering out the deleted project
                cache.writeQuery({
                    query: GET_PROJECTS_QUERY,
                    data: {
                        getProjects: existingProjects.getProjects.filter(
                            (project) => project.publicId !== deletedProjectId
                        ),
                    },
                });
            },
        }
    );

    const handleDeleteClick = (projectId: string) => {
        setProjectToDelete(projectId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (projectToDelete) {
            deleteProject({ variables: { publicId: projectToDelete } });
        }
        setIsModalOpen(false);
        setProjectToDelete(null);
    };

    if (loading) return (
        <div className="flex justify-center mt-20"><Spinner className={"w-10 h-10"} /></div>
    );
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;

    return (
        <>
        <div className="p-4 sm:p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <p className="text-slate-400 mt-1">
                    An overview of all ongoing and past projects.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.getProjects.map(project => (
                    <ProjectCard
                        key={project.publicId}
                        project={project}
                        onDeleteClick={handleDeleteClick}
                    />
                ))}
            </div>
        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Delete Project">
            <p className="text-slate-300 mb-6">
                Are you sure you want to delete this project? All associated tasks will also be deleted.
            </p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800"
                >
                    {deleteLoading ? 'Deleting...' : 'Delete Project'}
                </button>
            </div>
        </Modal>
    </>
    );
};

export default ProjectsPage;