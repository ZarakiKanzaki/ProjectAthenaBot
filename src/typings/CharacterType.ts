
export type TagType = {
    id?: string;
    type: number;
    name: string;
    level: number;
    isSubtractive: boolean;
};

export type CharacterThemebookType = {
    id?: string;
    themebookId: string;
    characterId?: string;
    typeId: number;
    title: string;
    concept: string;
    identityMistery: string;
    flipside: string;
    attentionLevel: number;
    fadeCrackLevel: number;
    tags: CharacterThemebookTagType[]
};

export type CharacterThemebookTagType = {
    id?: string;
    characterThemebookId: string;
    tagId: string;
    tagName: string;
};

export type CharacterType = {
    id?: string;
    userId?: string;
    guildMember: string;
    name: string;
    mythos: string;
    logos: string;
    note: string;
    themebooks: CharacterThemebookType[];
    tags: TagType[];
};