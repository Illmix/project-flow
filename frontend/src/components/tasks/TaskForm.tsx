import {useState, FormEvent, useEffect} from 'react';

interface TaskFormData {
    Name: string;
    Description?: string | null;
}

interface TaskFormProps {
    variant: 'create' | 'edit';
    onSubmit: (input: TaskFormData) => void;
    onCancel: () => void;
    loading: boolean;
    initialData?: {
        Name: string;
        Description?: string | null;
    };
}

const TaskForm = ({ variant, onSubmit, onCancel, loading, initialData }: TaskFormProps) => {
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
        if (!name.trim()) return;
        onSubmit({ Name: name, Description: description });
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