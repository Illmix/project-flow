import {useState, FormEvent, useEffect} from 'react';
import { CreateProjectInput } from '../../types/graphql';

interface CreateProjectFormProps {
    onSubmit: (input: CreateProjectInput) => void;
    onCancel: () => void;
    loading: boolean;
    initialData?: {
        Name: string;
        Description?: string | null;
    };
}

const CreateProjectForm = ({ onSubmit, onCancel, loading, initialData }: CreateProjectFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
            setDescription(initialData.Description || '');
        }
    }, [initialData]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ Name: name, Description: description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Name
                </label>
                <input
                    id="projectName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                    placeholder="e.g., Admin-panel"
                />
            </div>
            <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    id="projectDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                    placeholder="Describe the main goals of this project."
                />
            </div>
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Project')}
                </button>
            </div>
        </form>
    );
};

export default CreateProjectForm;