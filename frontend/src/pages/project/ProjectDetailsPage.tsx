import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery} from '@apollo/client';
import {GET_PROJECT_DETAILS_QUERY, GET_PROJECTS_QUERY} from '../../graphql/queries/projectQueries';
import {
    CreateTaskInput,
    DeleteProjectMutation, DeleteProjectMutationVariables,
    GetProjectDetailsQuery,
    GetProjectDetailsQueryVariables, GetProjectsQuery,
    Task, UpdateProjectMutation, UpdateProjectMutationVariables,
    CreateTaskMutation, CreateTaskMutationVariables
} from '../../types/graphql';
import Spinner from '../../components/ui/Spinner';
import TaskBoard from '../../components/tasks/TaskBoard';
import Modal from "../../components/ui/Modal.tsx";
import {useState} from "react";
import {DELETE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../graphql/mutations/projectMutations.ts";
import toast from "react-hot-toast";
import {Pencil, Plus, Trash2} from "lucide-react";
import CreateProjectForm from "../../components/projects/CreateProjectForm.tsx";
import {CREATE_TASK_MUTATION} from "../../graphql/mutations/taskMutations.ts";
import CreateTaskForm from "../../components/tasks/CreateTaskForm.tsx";

const ProjectDetailsPage = () => {
    const { publicId } = useParams<{ publicId: string }>();

    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

    const { data, loading, error } = useQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>(
        GET_PROJECT_DETAILS_QUERY,
        {
            variables: { publicId: publicId! },
            skip: !publicId,
        }
    );
    // --- Project Mutations ---
    const [updateProject, { loading: updateLoading }] = useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(
        UPDATE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project updated successfully!');
                setIsEditModalOpen(false);
            },
            onError: (err) => toast.error(`Error: ${err.message}`),
        }
    );

    const [deleteProject, { loading: deleteLoading }] = useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(
        DELETE_PROJECT_MUTATION,
        {
            onCompleted: () => {
                toast.success('Project deleted.');
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


    // --- Task Mutation ---
    const [createTask, { loading: createLoading }] = useMutation<CreateTaskMutation, CreateTaskMutationVariables>(
        CREATE_TASK_MUTATION, {
            onCompleted: () => {
                toast.success('Task created successfully! 🎉');
                setIsCreateTaskModalOpen(false);
            },
            onError: (error) => {
                toast.error(`Error: ${error.message}`);
            },
            update(cache, { data: result }) {
                const newTask = result?.createTask;
                if (!newTask) return;

                const existingDetails = cache.readQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>({
                    query: GET_PROJECT_DETAILS_QUERY,
                    variables: { publicId: publicId! },
                });

                // If the project is in the cache, update its tasks array
                if (existingDetails?.getProject) {
                    cache.writeQuery({
                        query: GET_PROJECT_DETAILS_QUERY,
                        variables: { publicId: publicId! },
                        data: {
                            getProject: {
                                ...existingDetails.getProject,
                                // Append the new task to the project's existing task list
                                tasks: [...[existingDetails.getProject.tasks], newTask],
                            },
                        },
                    });
                }
            }
        }
    );

    const handleCreateTask = (input: Omit<CreateTaskInput, 'projectPublicId'>) => {
        const fullInput: CreateTaskInput = {
            ...input,
            projectPublicId: publicId!,
        };
        createTask({ variables: { input: fullInput } });
    };

    const handleConfirmDelete = () => {
        deleteProject({ variables: { publicId: publicId! } });
        setIsDeleteModalOpen(false);
    };


    if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;

    const project = data?.getProject;
    if (!project) return <div className="text-slate-400 text-center mt-10">Project not found.</div>;


    return (
        <>
            <div className="flex flex-col">
                <header className="pb-4 border-b border-slate-700">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{project.Name}</h1>
                            <p className="text-slate-400 mt-2 max-w-3xl">{project.Description}</p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => setIsCreateTaskModalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                <Plus size={16} /> Create Task
                            </button>
                            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">
                                <Pencil size={16} /> Edit
                            </button>
                            <button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-900/50 text-red-300 hover:bg-red-900/80 transition-colors">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-grow">
                    <TaskBoard tasks={project.tasks as Task[] || []} />
                </div>
            </div>

            {/* Create Task Modal */}
            <Modal isOpen={isCreateTaskModalOpen} onClose={() => setIsCreateTaskModalOpen(false)} title="Create New Task">
                <CreateTaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setIsCreateTaskModalOpen(false)}
                    loading={createLoading}
                />
            </Modal>

            {/* Edit Project Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
                <CreateProjectForm
                    onSubmit={(input) => updateProject({ variables: { publicId: publicId!, input } })}
                    onCancel={() => setIsEditModalOpen(false)}
                    loading={updateLoading}
                    initialData={project}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
                <p className="text-slate-300 mb-6">
                    Are you sure you want to delete the project "<strong>{project.Name}</strong>"?
                    <strong> All related tasks will also be deleted.</strong>
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        disabled={deleteLoading}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700
                         disabled:bg-red-800">
                        {deleteLoading ? 'Deleting...' : 'Delete Project'}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProjectDetailsPage;