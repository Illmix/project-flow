import {useMutation, useQuery} from '@apollo/client';
import {
    CreateProjectInput,
    CreateProjectMutation, CreateProjectMutationVariables,
    DeleteProjectMutation,
    DeleteProjectMutationVariables,
    GetProjectsQuery
} from "../../types/graphql.ts";
import {GET_PROJECTS_QUERY} from "../../graphql/queries/projectQueries.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import ProjectCard from "../../components/projects/ProjectCard.tsx";
import {useState} from "react";
import {CREATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION} from "../../graphql/mutations/projectMutations.ts";
import Modal from "../../components/ui/Modal.tsx";
import toast from "react-hot-toast";
import CreateProjectForm from "../../components/projects/CreateProjectForm.tsx";
import {Plus} from "lucide-react";

const ProjectsPage = () => {
    const { data, loading, error: queryError } = useQuery<GetProjectsQuery>(GET_PROJECTS_QUERY);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const [createProject, { loading: createLoading }] = useMutation<CreateProjectMutation, CreateProjectMutationVariables>(
        CREATE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project created successfully!');
                setIsCreateModalOpen(false);
            },
            onError: (error) => {
                toast.error(`Error: ${error.message}`);
            },
            update(cache, { data: result }) {
                const newProject = result?.createProject;
                if (!newProject) return;

                const existingData = cache.readQuery<GetProjectsQuery>({ query: GET_PROJECTS_QUERY });
                if (existingData) {
                    cache.writeQuery({
                        query: GET_PROJECTS_QUERY,
                        data: {
                            getProjects: [newProject, ...existingData.getProjects],
                        },
                    });
                }
            },
        }
    );

    const handleCreateSubmit = (input: CreateProjectInput) => {
        createProject({ variables: { input } });
    };

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
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (projectToDelete) {
            deleteProject({ variables: { publicId: projectToDelete } });
        }
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
    };

    if (loading) return (
        <div className="flex justify-center mt-20"><Spinner className={"w-10 h-10"} /></div>
    );
    if (queryError) return <div className="text-red-400 text-center mt-10">Error: {queryError.message}</div>;

    return (
        <>
        <div>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400 mt-1">
                        An overview of all ongoing and past projects.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Create Project
                </button>
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

        {/* Modal for Creating a Project */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
            <CreateProjectForm
                onSubmit={handleCreateSubmit}
                onCancel={() => setIsCreateModalOpen(false)}
                loading={createLoading}
            />
        </Modal>

        {/* Modal for Deleting a Project */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
            <p className="text-slate-300 mb-6">
                Are you sure you want to delete this project? All associated tasks will also be deleted.
            </p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setIsDeleteModalOpen(false)}
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