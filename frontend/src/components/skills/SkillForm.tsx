import {FormEvent, useState} from "react";

interface SkillFormProps {
    onSubmit: (name: string) => void;
    loading: boolean;
    onCancel: () => void;
}

const SkillForm = ({ onSubmit, loading, onCancel }: SkillFormProps) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(name);
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., React"
                autoFocus
                disabled={loading}
                className="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </div>
        </form>
    )
}

export default SkillForm;