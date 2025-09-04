import {z} from "zod";
import {skillSchema} from "../../lib/validators.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
    onSubmit: (data: SkillFormData) => void;
    loading: boolean;
    onCancel: () => void;
}

const SkillForm = ({ onSubmit, loading, onCancel }: SkillFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
                type="text"
                {...register("Name")}
                placeholder="e.g., React"
                autoFocus
                disabled={loading || isSubmitting}
                className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.Name && <p className="text-red-400 text-sm mt-1">{errors.Name.message}</p>}
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">Cancel</button>
                <button type="submit" disabled={loading || isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                    {loading || isSubmitting ? 'Creating...' : 'Create'}
                </button>
            </div>
        </form>
    );
}

export default SkillForm;