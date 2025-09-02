import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { CREATE_SKILL_MUTATION } from '../graphql/mutations/skillMutations';
import { GET_SKILLS_QUERY } from '../graphql/queries/skillQueries';
import {CreateSkillMutation, CreateSkillMutationVariables, GetSkillsQuery} from '../types/graphql';

export const useSkillMutations = () => {
    const [createSkill, { loading: createSkillLoading }] = useMutation<CreateSkillMutation,
        CreateSkillMutationVariables>(CREATE_SKILL_MUTATION, {
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


    return {
        createSkill,
        loading: createSkillLoading,
    };
};
