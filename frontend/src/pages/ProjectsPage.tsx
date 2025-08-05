import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '../graphql/queries/projectQueries';
import { GetProjectsQuery } from '../types/graphql';
import Spinner from '../components/ui/Spinner';

const ProjectsPage = () => {
    const { data, loading, error } = useQuery<GetProjectsQuery>(GET_PROJECTS_QUERY);

    if (loading) return (
        <div className="flex justify-center mt-20"><Spinner className={"w-10 h-10"} /></div>
    );
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;

    return (
        <div className="p-4 sm:p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <p className="text-slate-400 mt-1">
                    An overview of all ongoing and past projects.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.getProjects.map(project => (
                    <span key={project.publicId}>{project.Name} {project.publicId}</span>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;