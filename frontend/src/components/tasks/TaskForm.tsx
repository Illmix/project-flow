import {useState, FormEvent, useEffect} from 'react';
import {Skill} from "../../types/graphql.ts";
import SkillSelector from "../skills/SkillSelector.tsx";

export interface TaskFormData {
    Name: string;
    Description?: string | null;
    requiredSkillIds: number[];
}

interface TaskFormProps {
    variant: 'create' | 'edit';
    onSubmit: (input: TaskFormData) => void;
    onCancel: () => void;
    loading: boolean;
    allSkills: Pick<Skill, 'id' | 'Name'>[];
    initialData?: {
        Name: string;
        Description?: string | null;
        requiredSkills?: Pick<Skill, 'id' | 'Name'>[] | null;
    };
}

const TaskForm = ({
                      variant,
                      onSubmit,
                      onCancel,
                      loading,
                      initialData,
                      allSkills,
}: TaskFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<Pick<Skill, 'id' | 'Name'>[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
            setDescription(initialData.Description || '');
            setSelectedSkills(initialData.requiredSkills || []);
        } else {
            setName('');
            setDescription('');
            setSelectedSkills([]);
        }
    }, [initialData, variant]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;
        const requiredSkillIds = selectedSkills.map(skill => skill.id);
        onSubmit({ Name: name, Description: description, requiredSkillIds });
    };

    const submitText = variant === 'create' ? 'Create Task' : 'Save Changes';
    const loadingText = variant === 'create' ? 'Creating...' : 'Saving...';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-slate-300 mb-2">
                    Task Name
                </label>
                <input
                    id="taskName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                />
            </div>
            <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    id="taskDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                />
            </div>
            <SkillSelector
                allSkills={allSkills as Skill[]}
                selectedSkills={selectedSkills as Skill[]}
                onChange={setSelectedSkills}
                loading={loading}
            />
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-md
                 bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50">
                    Cancel
                </button>
                <button type="submit" disabled={loading || !name.trim()} className="px-4 py-2 rounded-md bg-blue-600
                 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? loadingText : submitText}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;