import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { CREATE_SKILL_MUTATION } from '../graphql/mutations/skillMutations';
import { GET_SKILLS_QUERY } from '../graphql/queries/skillQueries';
import {CreateSkillMutation, CreateSkillMutationVariables, GetSkillsQuery, Skill} from '../types/graphql';

// The shape of the onCompleted callback
type CreateSkillOnCompleted = (newSkill: Skill) => void;

export const useSkillMutations = () => {
    const [createSkillMutation, { loading: createSkillLoading }] = useMutation<CreateSkillMutation,
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

    const createSkill = (variables: CreateSkillMutationVariables,
                         onCompleted?: CreateSkillOnCompleted) => {
        createSkillMutation({
            variables,
            onCompleted: (data) => {
                const newSkill = data.createSkill;
                if (newSkill) {
                    toast.success(`Skill "${newSkill.Name}" created!`);
                    if (onCompleted) {
                        onCompleted(newSkill as Skill);
                    }
                }
            },
        });
    };

    return {
        createSkill,
        loading: createSkillLoading,
    };
};
