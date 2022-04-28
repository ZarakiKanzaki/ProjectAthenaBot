import { TagQuestionType, ThemebookConceptType, ThemebookImprovementType, ThemebookType } from "../typings/ThemebookType";

export class Themebook {
    constructor(themebookOptions: ThemebookType) {
        Object.assign(this, themebookOptions);
    }
}

export class ThemebookConcept {
    constructor(themebookOptions: ThemebookConceptType) {
        Object.assign(this, themebookOptions);
    }
}


export class TagQuestion {
    constructor(themebookOptions: TagQuestionType) {
        Object.assign(this, themebookOptions);
    }
}


export class ThemebookImprovement {
    constructor(themebookOptions: ThemebookImprovementType) {
        Object.assign(this, themebookOptions);
    }
}

