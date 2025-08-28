import { MouseEvent } from 'react';
import { Skill } from '../../types/graphql';
import { Tag, Trash2 } from 'lucide-react';
import Card from '../ui/Card.tsx';

type SkillCardProps = {
    skill: Pick<Skill, 'id' | 'Name' | 'tasksCount'>;
    onDeleteClick: (skillId: number) => void;
};

const SkillCard = ({ skill, onDeleteClick }: SkillCardProps) => {
    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDeleteClick(skill.id);
    };

    return (
        <Card className="p-4 flex flex-col justify-between">
            <header className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Tag className="text-cyan-400 mt-1 flex-shrink-0" size={22} />
                    <h3 className="text-lg font-semibold text-slate-100">{skill.Name}</h3>
                </div>
                <button
                    onClick={handleDelete}
                    className="transition text-slate-500 hover:text-red-400 p-1"
                    aria-label={`Delete skill ${skill.Name}`}
                >
                    <Trash2 size={18} />
                </button>
            </header>
            <footer className="text-sm text-slate-400">
                Used in <span className="font-bold text-slate-200">{skill.tasksCount}</span> {skill.tasksCount === 1 ? 'task' : 'tasks'}
            </footer>
        </Card>
    );
};

export default SkillCard;