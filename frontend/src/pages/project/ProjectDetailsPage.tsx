import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery} from '@apollo/client';
import {GET_PROJECT_DETAILS_QUERY, GET_PROJECTS_QUERY} from '../../graphql/queries/projectQueries';
import {
    CreateTaskInput,
    DeleteProjectMutation, DeleteProjectMutationVariables,
    GetProjectDetailsQuery,
    GetProjectDetailsQueryVariables, GetProjectsQuery,
    Task, UpdateProjectMutation, UpdateProjectMutationVariables,
    CreateTaskMutation, CreateTaskMutationVariables, UpdateTaskInput, TaskStatus, GetSkillsQuery, Skill
} from '../../types/graphql';
import Spinner from '../../components/ui/Spinner';
import TaskBoard from '../../components/tasks/TaskBoard';
import Modal from "../../components/ui/Modal.tsx";
import {useEffect, useState} from "react";
import {DELETE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../graphql/mutations/projectMutations.ts";
import toast from "react-hot-toast";
import {Pencil, Plus, Trash2} from "lucide-react";
import ProjectForm from "../../components/projects/ProjectForm.tsx";
import {
    CREATE_TASK_MUTATION,
    DELETE_TASK_MUTATION,
    UPDATE_TASK_MUTATION
} from "../../graphql/mutations/taskMutations.ts";
import TaskForm from "../../components/tasks/TaskForm.tsx";
import {DragEndEvent} from "@dnd-kit/core";
import {GET_SKILLS_QUERY} from "../../graphql/queries/skillQueries.ts";
import { CREATE_SKILL_MUTATION } from '../../graphql/mutations/skillMutations.ts';

const ProjectDetailsPage = () => {
    const { publicId } = useParams<{ publicId: string }>();

    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
    const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // State for the skills in the task form modal
    const [skillsForTaskForm, setSkillsForTaskForm] = useState<Skill[]>([]);

    const [tasks, setTasks] = useState<Task[]>([]);

    const { data, loading, error } = useQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>(
        GET_PROJECT_DETAILS_QUERY,
        {
            variables: { publicId: publicId! },
            skip: !publicId,
        }
    );

    const { data: skillsData } = useQuery<GetSkillsQuery>(GET_SKILLS_QUERY);

    useEffect(() => {
        if (data?.getProject?.tasks) {
            setTasks(data.getProject.tasks as Task[]);
        }
    }, [data]);

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

    // --- Skill Mutation ---
    const [createSkill, { loading: createSkillLoading }] = useMutation(CREATE_SKILL_MUTATION, {
        onCompleted: (data) => {
            const newSkill = data.createSkill;
            if (newSkill) {
                toast.success(`Skill "${newSkill.Name}" created!`);
                setSkillsForTaskForm(prevSkills => [...prevSkills, newSkill]);
            }
        },
        onError: (err) => toast.error(`Error: ${err.message}`),
        update(cache, { data: result }) {
            const newSkill = result?.createSkill;
            const existingSkills = cache.readQuery<GetSkillsQuery>({ query: GET_SKILLS_QUERY });
            if (newSkill && existingSkills) {
                cache.writeQuery({
                    query: GET_SKILLS_QUERY,
                    data: { getSkills: [...existingSkills.getSkills, newSkill] },
                });
            }
        },
    });

    const handleCreateSkill = (skillName: string) => {
        createSkill({ variables: { input: { Name: skillName } } });
    };


    // --- Task Mutation ---
    const [createTask, { loading: createLoading }] = useMutation<CreateTaskMutation, CreateTaskMutationVariables>(
        CREATE_TASK_MUTATION, {
            onCompleted: () => {
                toast.success('Task created successfully!');
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
                                tasks: [...(existingDetails.getProject.tasks || []), newTask],
                            },
                        },
                    });
                }
            }
        }
    );

    const [updateTask, { loading: updateTaskLoading }] = useMutation(UPDATE_TASK_MUTATION, {
        onCompleted: () => {
            toast.success("Task updated successfully!");
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`)
            // IMPORTANT: Revert to server state on error
            if (data?.getProject?.tasks) {
                setTasks(data.getProject.tasks as Task[]);
            }
        },
        update(cache, { data: result }) {
            const updatedTask = result?.updateTask;
            if (!updatedTask) return;

            cache.modify({
                id: cache.identify(updatedTask),
                fields: {
                    Name() {
                        return updatedTask.Name;
                    },
                    Description() {
                        return updatedTask.Description;
                    },
                    requiredSkills() {
                        return updatedTask.requiredSkills;
                    },
                },
            });
        },
    });

    const [deleteTask, { loading: deleteTaskLoading }] = useMutation(DELETE_TASK_MUTATION, {
        onCompleted: () => {
            toast.success("Task deleted.");
            setIsTaskDeleteModalOpen(false);
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`)
        },
        update(cache, { data: result }) {
            const deletedTaskId = result?.deleteTask.publicId;
            if (!deletedTaskId) return;

            // Manually update the cache for an instant UI change
            cache.modify({
                id: cache.identify({ __typename: 'Project', publicId: publicId }),
                fields: {
                    tasks(existingTasks = [], { readField }) {
                        return existingTasks.filter(
                            (taskRef: any) => readField('publicId', taskRef) !== deletedTaskId
                        );
                    }
                }
            });
        }
    });

    const handleTaskEditClick = (task: Task) => {
        setSelectedTask(task);
        setSkillsForTaskForm(task.requiredSkills ? [...task.requiredSkills] as Skill[] : []);
        setIsTaskEditModalOpen(true);
    };

    const handleTaskDeleteClick = (task: Task) => {
        setSelectedTask(task);
        setIsTaskDeleteModalOpen(true);
    };

    const handleUpdateTaskSubmit = (input: Pick<UpdateTaskInput, 'Name' | 'Description' | "requiredSkillIds">) => {
        if (!selectedTask) return;
        updateTask({
            variables: {
                publicId: selectedTask.publicId,
                input: {
                    Name: input.Name,
                    Description: input.Description,
                    requiredSkillIds: skillsForTaskForm.map(s => s.id),
                },
            },
        });
        setIsTaskEditModalOpen(false);
    };

    const handleTaskStatusChange = (
        event: DragEndEvent
    ) => {
        const { active, over } = event;
        if (!over) return;

        const draggedTask = tasks.find(t => t.publicId === active.id);
        if (!draggedTask) return;

        let newStatus: TaskStatus;
        const overIsAColumn = Object.values(TaskStatus).includes(over.id as TaskStatus);

        if (overIsAColumn) {
            newStatus = over.id as TaskStatus;
        } else {
            const overTask = tasks.find(t => t.publicId === over.id);
            if (!overTask) return;
            newStatus = overTask.Status;
        }

        // Check that the status of the task has changed
        if (draggedTask.Status === newStatus) {
            return;
        }
        // --- OPTIMISTIC UPDATE ---
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.publicId === active.id ? { ...task, Status: newStatus } : task
            )
        );

        // --- TRIGGER MUTATION ---
        updateTask({
            variables: {
                publicId: active.id as string,
                input: {
                    Status: newStatus,
                }
            },
            optimisticResponse: {
                updateTask: {
                    __typename: 'Task',
                    publicId: active.id,
                    Status: newStatus,
                    // Feature: Provide all data from the task
                    Name: tasks.find(t => t.publicId === active.id)?.Name || '',
                    Description: tasks.find(t => t.publicId === active.id)?.Description || '',
                    requiredSkills: tasks.find(t => t.publicId === active.id)?.requiredSkills || [],
                }
            }
        });
    };

    const handleTaskConfirmDelete = () => {
        if (!selectedTask) return;
        deleteTask({ variables: { publicId: selectedTask.publicId }});
    };

    const handleCreateTask = (input: Omit<CreateTaskInput, 'projectPublicId'>) => {
        const fullInput: CreateTaskInput = {
            ...input,
            projectPublicId: publicId!,
        };
        createTask({ variables: { input: fullInput } });
        setIsCreateTaskModalOpen(false);
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
                    <TaskBoard
                        tasks={tasks}
                        onEditTask={handleTaskEditClick}
                        onDeleteTask={handleTaskDeleteClick}
                        onTaskStatusChange={handleTaskStatusChange}
                    />
                </div>
            </div>

            {/* --- Modals for Tasks --- */}
            <Modal isOpen={isTaskEditModalOpen} onClose={() => setIsTaskEditModalOpen(false)} title="Edit Task">
                <TaskForm
                    variant={"edit"}
                    onSubmit={handleUpdateTaskSubmit}
                    onCancel={() => setIsTaskEditModalOpen(false)}
                    loading={updateTaskLoading || createSkillLoading}
                    initialData={selectedTask ? { Name: selectedTask.Name, Description: selectedTask.Description } : undefined}
                    allSkills={skillsData?.getSkills || []}
                    selectedSkills={skillsForTaskForm}
                    setSelectedSkills={setSkillsForTaskForm}
                    onCreateSkill={handleCreateSkill}
                />
            </Modal>

            <Modal isOpen={isTaskDeleteModalOpen} onClose={() => setIsTaskDeleteModalOpen(false)} title="Delete Task">
                <p className="text-slate-300 mb-6">
                    Are you sure you want to delete the task "<strong>{selectedTask?.Name}</strong>"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setIsTaskDeleteModalOpen(false)} className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">
                        Cancel
                    </button>
                    <button onClick={handleTaskConfirmDelete} disabled={deleteTaskLoading} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800">
                        {deleteTaskLoading ? 'Deleting...' : 'Delete Task'}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isCreateTaskModalOpen} onClose={() => setIsCreateTaskModalOpen(false)} title="Create New Task">
                <TaskForm
                    variant={"create"}
                    onSubmit={handleCreateTask}
                    selectedSkills={skillsForTaskForm}
                    setSelectedSkills={setSkillsForTaskForm}
                    onCreateSkill={handleCreateSkill}
                    onCancel={() => setIsCreateTaskModalOpen(false)}
                    loading={createLoading}
                    allSkills={skillsData?.getSkills || []}
                />
            </Modal>


            {/* Edit Project Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
                <ProjectForm
                    onSubmit={(input) => updateProject({ variables: { publicId: publicId!, input } })}
                    onCancel={() => setIsEditModalOpen(false)}
                    loading={updateLoading}
                    initialData={project}
                />
            </Modal>

            {/* Delete Project Confirmation Modal */}
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