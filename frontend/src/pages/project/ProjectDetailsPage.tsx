import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_DETAILS_QUERY } from '../../graphql/queries/projectQueries';
import {GetProjectDetailsQuery, GetProjectDetailsQueryVariables, Task} from '../../types/graphql';
import Spinner from '../../components/ui/Spinner';
import TaskBoard from '../../components/tasks/TaskBoard';

const ProjectDetailsPage = () => {
    const { publicId } = useParams<{ publicId: string }>();

    const { data, loading, error } = useQuery<GetProjectDetailsQuery, GetProjectDetailsQueryVariables>(
        GET_PROJECT_DETAILS_QUERY,
        {
            variables: { publicId: publicId! },
            skip: !publicId,
        }
    );

    if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
    if (error) return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;
    if (!data?.getProject) return <div className="text-slate-400 text-center mt-10">Project not found.</div>;

    const { getProject: project } = data;
    console.log(project.tasks)

    return (
        <div className="flex flex-col">
            <header className="mb-6 pb-4 border-b border-slate-700">
                <h1 className="text-3xl font-bold text-white">{project.Name}</h1>
                <p className="text-slate-400 mt-2">{project.Description}</p>
            </header>

            <div className="flex-grow">
                <TaskBoard tasks={project.tasks as Task[] || []} />
            </div>
        </div>
    );
};

export default ProjectDetailsPage;