import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { GetSkillsQuery } from '../../types/graphql';
import { GET_SKILLS_QUERY } from '../../graphql/queries/skillQueries';
import { CREATE_SKILL_MUTATION } from '../../graphql/mutations/skillMutations';
import SkillCard from '../../components/skills/SkillCard';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import SkillForm from "../../components/skills/SkillForm.tsx";

const SkillsPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, loading, error } = useQuery<GetSkillsQuery>(GET_SKILLS_QUERY);

    const [createSkill, { loading: createLoading }] = useMutation(CREATE_SKILL_MUTATION, {
        onCompleted: () => {
            toast.success('Skill created successfully!');
            setIsCreateModalOpen(false);
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

    const handleCreateSubmit = (name: string) => {
        if (!name.trim()) return;
        createSkill({ variables: { input: { Name: name } } });
    };


    if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;

    return (
        <>
            <header className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skills</h1>
                    <p className="text-slate-400 mt-1">Manage the skills used in your projects.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    <Plus size={16} /> Create Skill
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {data?.getSkills.map(skill => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                    />
                ))}
            </div>

            {/* Create Skill Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Skill">
                <SkillForm onSubmit={handleCreateSubmit} loading={createLoading} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>
        </>
    );
};


export default SkillsPage;