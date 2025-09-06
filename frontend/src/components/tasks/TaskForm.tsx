import {useEffect} from 'react';
import {Skill} from "../../types/graphql.ts";
import SkillSelector from "../skills/SkillSelector.tsx";
import { taskSchema } from '../../lib/validators.ts';
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    variant: 'create' | 'edit';
    onSubmit: (input: TaskFormData) => void;
    onCancel: () => void;
    loading: boolean;
    allSkills: Skill[];

    selectedSkills: Skill[];
    setSelectedSkills: (skills: Skill[]) => void;
    onCreateSkill: (skillName: string) => void;

    initialData?: TaskFormData;
}

const TaskForm = ({
                      variant,
                      onSubmit,
                      onCancel,
                      loading,
                      initialData,
                      allSkills,
                      selectedSkills,
                      setSelectedSkills,
                      onCreateSkill
}: TaskFormProps ) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialData || { Name: '', Description: '', requiredSkillIds: [] },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({ Name: '', Description: '', requiredSkillIds: [] });
        }
    }, [initialData, reset]);

    useEffect(() => {
        const skillIds = selectedSkills.map(skill => skill.id);
        setValue('requiredSkillIds', skillIds);
    }, [selectedSkills, setValue]);

    const submitText = variant === 'create' ? 'Create Task' : 'Save Changes';
    const loadingText = variant === 'create' ? 'Creating...' : 'Saving...';

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-slate-300 mb-2">
                    Task Name
                </label>
                <input
                    id="taskName"
                    type="text"
                    {...register("Name")}
                    disabled={loading || isSubmitting}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md
                    bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
                />
                {errors.Name && <p className="text-red-400 text-sm mt-1">{errors.Name.message}</p>}
            </div>
            <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    id="taskDescription"
                    {...register("Description")}
                    disabled={loading || isSubmitting}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-600
                    rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <SkillSelector
                allSkills={allSkills}
                selectedSkills={selectedSkills}
                onChange={setSelectedSkills}
                onCreateSkill={onCreateSkill}
                loading={loading || isSubmitting}
            />
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} disabled={loading || isSubmitting}
                        className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">
                    Cancel
                </button>
                <button type="submit" disabled={loading || isSubmitting}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white
                         hover:bg-blue-700 disabled:opacity-60">
                    {loading || isSubmitting ? loadingText : submitText}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;