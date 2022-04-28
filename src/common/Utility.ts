import { CommandInteractionOptionResolver } from "discord.js";
import dataService, { client } from "..";
import { ExtendedInteraction } from "../typings/CommandType";
import { ThemebookType } from "../typings/ThemebookType";

const MythosColour = "#4a48bb";
const LogosColour = "#c36521";
const CHAR_SEPARATOR = '_';
const ARGUMENT_SEPARATOR = '&&';

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


export function removeElementFromListById(list:any[], elementToRemove:any) {
    return list.filter((element) => {
        return element.themebook.id !== elementToRemove.id;
      });
}
export function getCommandName(interaction) {
    return interaction.customId.split(CHAR_SEPARATOR)[0];
}

export function getCommandFromClient(commandName: string) {
    return client.commands.get(commandName);
}

export function redirectToCommand(interaction) {
    const commandName = getCommandName(interaction);
    const command = getCommandFromClient(commandName);
    const arrayOfOptions = dataService.interactions.find(x => x.guildMember === interaction.user.id);
    let args = dataService.optionsToDeliver.find(x => x.guildMember === interaction.user.id && x.operation === interaction.customId).arguments;

    arrayOfOptions.options._hoistedOptions = args;

    (interaction as any).options = arrayOfOptions;

    command.run({
        arguments: (interaction as any).options as CommandInteractionOptionResolver,
        client,
        interaction: (interaction as any) as ExtendedInteraction,
    });
}