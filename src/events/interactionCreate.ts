import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { getCommandFromClient,  isNullOrUndefined, redirectToCommand } from "../common/Utility";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/CommandType";



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
        redirectToCommand(interaction);
    }
});
