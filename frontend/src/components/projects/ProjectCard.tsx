import { Project } from '../../types/graphql';
import { format } from 'date-fns';
import {FolderCode, Trash2} from 'lucide-react';
import Card from "../ui/Card.tsx";
import {useNavigate} from "react-router-dom";
import {MouseEvent} from "react";

type ProjectCardProps = {
    project: Pick<Project, 'publicId' | 'Name' | 'Description' | 'created_at'>;
    onDeleteClick: (e: MouseEvent<HTMLButtonElement>, projectId: string) => void;
};

const ProjectCard = ({ project, onDeleteClick }: ProjectCardProps) => {
    const navigate = useNavigate();

    const onProjectClick = () => {
        navigate(`/project/${project.publicId}`);
    }

    return (
        <Card
            onClick={onProjectClick}
            className={"transition-transform flex flex-col justify-between hover:scale-[1.02] cursor-pointer"}>
            <div className="p-3 flex flex-col flex-grow">
                <div className="mb-2">
                    <header className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <FolderCode className="text-blue-400 mt-1 flex-shrink-0" size={24} />
                            <h3 className="text-lg font-semibold text-slate-100">{project.Name}</h3>
                        </div>
                    </header>
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {project.Description}
                    </p>
                </div>
                <footer className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                    <span>
                        {format(new Date(project.created_at), 'd MMM, yyyy')}
                    </span>
                    <button
                        onClick={(e) => onDeleteClick(e, project.publicId)}
                        className="transition text-slate-500 hover:text-red-400 p-1"
                        aria-label="Delete project"
                    >
                        <Trash2 size={18} />
                    </button>
                </footer>
            </div>
        </Card>
    );
};

export default ProjectCard;