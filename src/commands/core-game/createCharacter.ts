import { Command } from "../../structures/Command";
import dataService, { graphQL } from "../..";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ApplicationCommandOptionData, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { themebookListQuery } from "../../common/GraphQueries";
import { getInteractionParameters, getThemebookColour, isNullOrUndefined } from "../../common/Utility";
import { ExtendedInteraction } from "../../typings/CommandType";


const firstStepOptions: ApplicationCommandOptionData[] = [
    {
        name: "complete-name",
        description: "Choose your character name",
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
    },
    {
        name: "logos",
        description: "Who is your character day by day?",
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
    },
    {
        name: "mythos",
        description: "Which legend resides inside your character?",
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
    },

];


export default new Command({
    name: 'character',
    description: 'Start a tutorial to create your City of Mist Character!',
    options: firstStepOptions,
    isInternal: false,
    run: async ({ interaction }) => {
        // try {

        const character = dataService.characters.find(x => x.guildMember === interaction.user.id);

        if (character?.themebooks?.length === 4) {

        }
        else if (isNullOrUndefined(character)) {
            const characterName = interaction.options.getString('complete-name');
            const logos = interaction.options.getString('logos');
            const mythos = interaction.options.getString('mythos');

            await handleMessageCreation(characterName, logos, mythos, interaction);
        }
        else {
            const characterName = getOptionByName(interaction, 'complete-name');
            const logos = getOptionByName(interaction, 'logos');
            const mythos = getOptionByName(interaction, 'mythos');
            await handleMessageCreation(characterName, logos, mythos, interaction);
        }

        // } catch (error) {
        //     await interaction.reply(error);
        // }
    }
});




async function handleMessageCreation(characterName: string, logos: string, mythos: string, interaction: ExtendedInteraction,) {

    let themebooks = await getThemebookHeads();

    let embeddedMessages: MessageEmbed[] = [];
    let embeddedButtons: MessageButton[] = [];

    handleButtonAndEmbed(themebooks, embeddedMessages, embeddedButtons, interaction);

    sendFirstPartOfCharacter(interaction, characterName, logos, mythos);
    
    dataService.interactions.push({ guildMember: interaction.user.id, options: interaction.options });

    await interaction.deferReply();
    interaction.followUp(BuildThemebookListMessage(embeddedMessages, embeddedButtons));
}

function sendFirstPartOfCharacter(interaction: ExtendedInteraction, characterName: string, logos: string, mythos: string) {
    interaction.character = {
        "guildMember": interaction.user.id,
        "name": characterName,
        "logos": logos,
        "mythos": mythos,
        "note":'',
        "themebooks": [],
        "tags":[]
    };

    dataService.characters.push(interaction.character);
}

function getOptionByName(interaction: ExtendedInteraction, name: string) {
    return getInteractionParameters(interaction).find(x => x.name === name).value;
}

function handleButtonAndEmbed(themebooks: any, embeddedMessages: MessageEmbed[], embeddedButtons: MessageButton[], interaction: ExtendedInteraction) {
    themebooks.forEach(themebook => {
        embeddedMessages.push(CreateEmbedForThemebook(themebook));
        embeddedButtons.push(CreateMessageButtonForThemebook(themebook, interaction));
    });
}

function BuildThemebookListMessage(embeddedMessages: MessageEmbed[], embeddedButtons: MessageButton[]) {
    return {
        content: "Please click on the themebook's button you want to start compiling.",
        embeds: embeddedMessages,
        components: [new MessageActionRow().addComponents(embeddedButtons)],
        ephemeral: true,
    };
}

function CreateMessageButtonForThemebook(themebook: any, interaction: ExtendedInteraction): MessageButton {
    const operationName = `startThemebook_${themebook.id}`;
    dataService.optionsToDeliver.push({
        "guildMember": interaction.user.id,
        "operation": operationName,
        "arguments": [{
            "name": `themebookId`,
            "type": "STRING",
            "value": `${themebook.id}`,
        }],
    });
    return new MessageButton()
        .setCustomId(operationName)
        .setLabel(`${themebook.name}`)
        .setStyle('PRIMARY');
}

function CreateEmbedForThemebook(themebook: any): MessageEmbed {

    return new MessageEmbed()
        .setTitle(`${themebook.name}`)
        .setDescription(`${themebook.examplesOfApplication}`)
        .setColor(getThemebookColour(themebook));
}

async function getThemebookHeads() {
    return (await graphQL.query({ query: themebookListQuery })).data.themebooks;
}

