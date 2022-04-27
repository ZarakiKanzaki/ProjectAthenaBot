import { CommandInteractionOptionResolver } from "discord.js";
import dataService, { client } from "..";
import { isNullOrUndefined } from "../common/Utility";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/CommandType";

const CHAR_SEPARATOR = '_';
const ARGUMENT_SEPARATOR = '&&';

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        //await interaction.deferReply();
        const command = getCommandFromClient(interaction.commandName);

        if (isNullOrUndefined(command)) {
            return interaction.followUp('You have used a non existent command');
        }

        command.run({
            arguments: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });
    }
    else if (interaction.isButton()) {
        console.log(interaction.customId);
        console.log(interaction.user.id);
        const commandName = getCommandName(interaction);
        const command = getCommandFromClient(commandName);
        const arrayOfOptions = dataService.interactions.find(x => x.guildMember === interaction.user.id);
        let args = dataService.optionsToDeliver.find(x => x.guildMember === interaction.user.id && x.operation === commandName).arguments;
        
        console.log(args);
        
        arrayOfOptions.options._hoistedOptions = args;
        
        (interaction as any).options = arrayOfOptions;

        console.log(command);

        command.run({
            arguments: (interaction as any).options as CommandInteractionOptionResolver,
            client,
            interaction: (interaction as any) as ExtendedInteraction,
        });
    }
});

function getCommandFromClient(commandName: string) {
    return client.commands.get(commandName);
}

function getCommandName(interaction) {
    return interaction.customId.split(CHAR_SEPARATOR)[0];
}
