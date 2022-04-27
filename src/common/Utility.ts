import { ExtendedInteraction } from "../typings/CommandType";
import { ThemebookType } from "../typings/ThemebookType";

const MythosColour = "#4a48bb";
const LogosColour = "#c36521";

export function isNullOrUndefined(element: any): Boolean {
    return typeof element === 'undefined' || !element;
}

export function isNullOrEmpty(element: String): Boolean {
    return isNullOrUndefined(element) || element === '';
}

export function getThemebookColour(themebook: any) {
    return themebook.type.name === 'Mythos' ? MythosColour : LogosColour;
}

export function getInteractionParameters(interaction: ExtendedInteraction) {
    return (interaction.options as any).options._hoistedOptions;
}

export function getThemebookId(interaction: ExtendedInteraction): string {
    return getInteractionParameters(interaction).find(x => x.name === 'themebookId').value;
}

export function defineIdentityOrMistery(themebook: ThemebookType) {
    return themebook.type.name === 'Mythos' ? "Mistery" : "Identity";
}
