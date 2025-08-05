import { Project } from '../../types/graphql';
import { format } from 'date-fns';
import {FolderCode} from 'lucide-react';
import Card from "../ui/Card.tsx";

type ProjectCardProps = {
    project: Pick<Project, 'Name' | 'Description' | 'created_at'>;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <Card className={"transition-transform hover:scale-[1.02] cursor-pointer"}>
            <div className="flex items-center gap-4 mb-3">
                <FolderCode className="text-blue-400" size={24} />
                <h3 className="text-lg font-semibold text-slate-100">{project.Name}</h3>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                {project.Description}
            </p>
            <p className="text-xs text-slate-500">
                Created: {format(new Date(project.created_at), 'MMMM d, yyyy')}
            </p>
        </Card>
    );
};

export default ProjectCard;