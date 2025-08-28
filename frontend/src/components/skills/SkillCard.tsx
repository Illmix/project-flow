import { Skill } from '../../types/graphql';
import { Tag } from 'lucide-react';
import Card from '../ui/Card.tsx';

type SkillCardProps = {
    skill: Pick<Skill, 'id' | 'Name' | 'tasksCount'>;
};

const SkillCard = ({ skill }: SkillCardProps) => {
    return (
        <Card className="p-4 flex flex-col justify-between">
            <header className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Tag className="text-cyan-400 mt-1 flex-shrink-0" size={22} />
                    <h3 className="text-lg font-semibold text-slate-100">{skill.Name}</h3>
                </div>
            </header>
            <footer className="text-sm text-slate-400">
                Used in <span className="font-bold text-slate-200">{skill.tasksCount}</span> {skill.tasksCount === 1 ? 'task' : 'tasks'}
            </footer>
        </Card>
    );
};

export default SkillCard;