import {useEffect} from 'react';
import { CreateProjectInput } from '../../types/graphql';
import { z } from 'zod';
import { projectSchema } from '../../lib/validators';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
    onSubmit: (input: CreateProjectInput) => void;
    onCancel: () => void;
    loading: boolean;
    initialData?: ProjectFormData;
}

const ProjectForm = ({ onSubmit, onCancel, loading, initialData }: CreateProjectFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: initialData || { Name: '', Description: '' },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Name
                </label>
                <input
                    id="projectName"
                    type="text"
                    {...register("Name")}
                    disabled={loading || isSubmitting}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Admin-panel dashboard"
                />
                {errors.Name && <p className="text-red-400 text-sm mt-1">{errors.Name.message}</p>}
            </div>
            <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    id="projectDescription"
                    {...register("Description")}
                    disabled={loading || isSubmitting}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the main goals of this project."
                />
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} disabled={loading || isSubmitting} className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">
                    Cancel
                </button>
                <button type="submit" disabled={loading || isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                    {loading || isSubmitting ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;