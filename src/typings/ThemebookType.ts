
export type ThemebookImprovementType = {
    title: string;
    description: string;
};

export type TagQuestionType = {
    question: string;
    type: number;
    answers: string[];
};

export type ThemebookConceptType = {
    question: string;
    answers: string[];
};

export type ThemebookType = {
    id: string;
    name: string;
    description: string;
    type: {
        name:string;
    };
    themebookConcept: ThemebookConceptType;
    examplesOfApplication: string[];
    identityMisteryOptions: string[];
    titleExamples: string[];
    crewRelationships: string[];
    tagQuestions: TagQuestionType[];
};

