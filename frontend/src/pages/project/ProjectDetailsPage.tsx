import {useParams} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import {GET_PROJECT_DETAILS_QUERY} from '../../graphql/queries/projectQueries';
import {
    CreateTaskInput,
    GetProjectDetailsQuery,
    GetProjectDetailsQueryVariables,
    Task, UpdateTaskInput, TaskStatus, GetSkillsQuery, Skill
} from '../../types/graphql';
import Spinner from '../../components/ui/Spinner';
import TaskBoard from '../../components/tasks/TaskBoard';
import Modal from "../../components/ui/Modal.tsx";
import {useEffect, useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";
import ProjectForm from "../../components/projects/ProjectForm.tsx";
import TaskForm from "../../components/tasks/TaskForm.tsx";
import {DragEndEvent} from "@dnd-kit/core";
import {GET_SKILLS_QUERY} from "../../graphql/queries/skillQueries.ts";
import {useProjectMutations} from "../../hooks/useProjectMutations.ts";
import { useSkillMutations } from '../../hooks/useSkillMutations.ts';
import {useTaskMutations} from "../../hooks/useTaskMutations.ts";

const ProjectDetailsPage = () => {
    const { publicId } = useParams<{ publicId: string }>();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
    const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // State for the skills in the task form modal
    const [skillsForTaskForm, setSkillsForTaskForm] = useState<Skill[]>([]);

    const [tasks, setTasks] = useState<Task[]>([]);

    // --- Data Fetching ---
    const { data, loading, error } = useQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>(
        GET_PROJECT_DETAILS_QUERY, { variables: { publicId: publicId! }, skip: !publicId }
    );
    const { data: skillsData } = useQuery<GetSkillsQuery>(GET_SKILLS_QUERY);

    // --- Custom hooks to handle mutations logic ---
    const { updateProject, deleteProject, loading: projectLoading } = useProjectMutations();
    const { createSkill, loading: skillLoading } = useSkillMutations();
    const { createTask, updateTask, deleteTask, loading: taskLoading } = useTaskMutations(publicId!);

    // Sync local task state when query data changes
    useEffect(() => {
        if (data?.getProject?.tasks) {
            setTasks(data.getProject.tasks as Task[]);
        }
    }, [data]);

    const project = data?.getProject;

    // --- Event Handlers ---
    const handleCreateTask = (input: Omit<CreateTaskInput, 'projectPublicId'>) => {
        const fullInput: CreateTaskInput = { ...input, projectPublicId: publicId! };
        createTask({ input: fullInput }, () => {
            setIsCreateTaskModalOpen(false);
            setSkillsForTaskForm([]);
        });
    };

    const handleUpdateTaskSubmit = (input: Pick<UpdateTaskInput, 'Name' | 'Description' | 'requiredSkillIds'>) => {
        if (!selectedTask) return;
        updateTask({
            publicId: selectedTask.publicId,
            input: {
                Name: input.Name,
                Description: input.Description,
                requiredSkillIds: skillsForTaskForm.map(s => s.id),
            },
        }, () => {
            setIsTaskEditModalOpen(false);
        });
    };

    const handleTaskStatusChange = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !project?.tasks || active.id === over.id) return;

        const originalTasks = tasks;
        const draggedTask = originalTasks.find(t => t.publicId === active.id);
        const newStatus = over.id as TaskStatus;

        if (!draggedTask || draggedTask.Status === newStatus) return;

        // Optimistic UI update
        const updatedTasks = originalTasks.map(t => t.publicId === active.id ? { ...t, Status: newStatus } : t);
        setTasks(updatedTasks);

        updateTask(
            { publicId: active.id as string, input: { Status: newStatus } },
            undefined,
            () => setTasks(originalTasks) // Revert on error
        );
    };

    const handleTaskEditClick = (task: Task) => {
        setSelectedTask(task);
        setSkillsForTaskForm(task.requiredSkills ? [...task.requiredSkills] as Skill[] : []);
        setIsTaskEditModalOpen(true);
    };

    const handleTaskDeleteClick = (task: Task) => {
        setSelectedTask(task);
        setIsTaskDeleteModalOpen(true);
    };

    if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;
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

            {/* --- Modals --- */}
            <Modal
                isOpen={isTaskEditModalOpen}
                onClose={() => {setIsTaskEditModalOpen(false);
                    setSkillsForTaskForm([])}}
                title="Edit Task">
                <TaskForm
                    variant="edit"
                    onSubmit={handleUpdateTaskSubmit}
                    onCancel={() => {setIsTaskEditModalOpen(false)}}
                    loading={taskLoading || skillLoading}
                    initialData={selectedTask || undefined}
                    allSkills={skillsData?.getSkills || []}
                    selectedSkills={skillsForTaskForm}
                    setSelectedSkills={setSkillsForTaskForm}
                    onCreateSkill={(name) => createSkill({ input: { Name: name } },
                        (newSkill) => setSkillsForTaskForm(prev => [...prev, newSkill]))} />
            </Modal>
            <Modal
                isOpen={isCreateTaskModalOpen}
                onClose={() => {setIsCreateTaskModalOpen(false);
                    setSkillsForTaskForm([])}} title="Create New Task">
                <TaskForm
                    variant="create"
                    onSubmit={handleCreateTask}
                    onCancel={() => {setIsCreateTaskModalOpen(false); setSkillsForTaskForm([])}}
                    loading={taskLoading || skillLoading}
                    allSkills={skillsData?.getSkills || []}
                    selectedSkills={skillsForTaskForm}
                    setSelectedSkills={setSkillsForTaskForm}
                    onCreateSkill={(name) => createSkill({ input: { Name: name } },
                        (newSkill) => setSkillsForTaskForm(prev => [...prev, newSkill]))} />
            </Modal>
            <Modal isOpen={isTaskDeleteModalOpen}
                   onClose={() => setIsTaskDeleteModalOpen(false)}
                   title="Delete Task">
                <p className="text-slate-300 mb-6">
                    Are you sure you want to delete the task "<strong>{selectedTask?.Name}</strong>"?
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setIsTaskDeleteModalOpen(false)}
                            className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">
                        Cancel
                    </button>
                    <button onClick={() => deleteTask({ publicId: selectedTask!.publicId },
                        () => setIsTaskDeleteModalOpen(false))} disabled={taskLoading}
                            className="px-4 py-2 rounded-md bg-red-600
                             text-white hover:bg-red-700 disabled:bg-red-800">
                        {taskLoading ? 'Deleting...' : 'Delete Task'}
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Project">
                <ProjectForm
                    onSubmit={(input) =>
                        updateProject({ variables: { publicId: publicId!, input },
                            onCompleted: () => setIsEditModalOpen(false) })}
                    onCancel={() => setIsEditModalOpen(false)}
                    loading={projectLoading}
                    initialData={project}
                />
            </Modal>
            <Modal isOpen={isDeleteModalOpen}
                   onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
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
                        onClick={() =>
                            deleteProject({ variables: { publicId: publicId! } })}
                        disabled={projectLoading}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800">
                        {projectLoading ? 'Deleting...' : 'Delete Project'}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProjectDetailsPage;