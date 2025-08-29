import {useState, useMemo, useRef, useEffect, RefObject} from 'react';
import { Skill } from '../../types/graphql';
import { X } from 'lucide-react';

type SkillSelectorProps = {
    allSkills: Skill[];
    selectedSkills: Skill[];
    onChange: (newSelection: Skill[]) => void;
    onCreateSkill: (skillName: string) => void;
    loading?: boolean;
};

// A custom hook to detect clicks outside the component
const useClickOutside = (ref: RefObject<HTMLDivElement | null>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const SkillSelector = ({
                           allSkills,
                           selectedSkills,
                           onChange,
                           loading,
                           onCreateSkill
}: SkillSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useClickOutside(wrapperRef, () => setIsOpen(false));

    const selectedSkillIds = useMemo(() => new Set(selectedSkills.map(s => s.id)), [selectedSkills]);

    // Filter available skills based on search term and what's already selected
    const filteredOptions = useMemo(() => {
        const availableSkills = allSkills.filter(skill => !selectedSkillIds.has(skill.id));

        // Filter by search term if one exists
        const finalFiltered = searchTerm
            ? availableSkills.filter(skill => skill.Name.toLowerCase().includes(searchTerm.toLowerCase()))
            : availableSkills; // If no search term, show all available

        // Check if the user's term can be a new skill
        const exactMatch = allSkills.some(skill => skill.Name.toLowerCase() === searchTerm.toLowerCase().trim());
        if (searchTerm.trim() && !exactMatch) {
            // Special create option
            finalFiltered.push({
                id: -1, // Temporary ID
                Name: searchTerm.trim(),
                tasksCount: 0,
                __typename: 'Skill',
            });
        }

        return finalFiltered;
    }, [searchTerm, allSkills, selectedSkillIds]);

    const handleSelectOption = (skill: Skill) => {
        if (skill.id === -1) {
            onCreateSkill(searchTerm.trim());
        } else {
            onChange([...selectedSkills, skill]);
        }
        setSearchTerm(''); // Clear input after selection
        setIsOpen(false);
    };

    const removeSkill = (skillId: number) => {
        onChange(selectedSkills.filter(s => s.id !== skillId));
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
                Required Skills
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-slate-600 rounded-md bg-slate-700 min-h-[44px]">
                {selectedSkills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2 bg-blue-900/50 text-blue-200 text-sm px-2 py-1 rounded">
                        <span>{skill.Name}</span>
                        <button type="button" onClick={() => removeSkill(skill.id)} className="text-blue-300 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={selectedSkills.length > 0 ? "Add another skill..." : "Search for skills..."}
                    disabled={loading}
                    className="flex-grow bg-transparent text-white focus:outline-none p-1"
                />
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.map(skill => (
                        <li
                            key={skill.id}
                            onClick={() => handleSelectOption(skill)}
                            className="px-4 py-2 text-slate-300 hover:bg-slate-700 cursor-pointer"
                        >
                            {skill.Name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SkillSelector;