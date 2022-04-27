import { Command } from "../../structures/Command";
import dataService, { graphQL } from "../..";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ApplicationCommandOptionData, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { getThemebookByKey } from "../../common/GraphQueries";
import { ExtendedInteraction } from "../../typings/CommandType";
import { defineIdentityOrMistery, getInteractionParameters, getThemebookColour, getThemebookId } from "../../common/Utility";
import { ThemebookType } from "../../typings/ThemebookType";


const MIDDLE_DOT = ' · ';

export default new Command({
  name: 'startThemebook',
  description: 'Start a themebook questionaire',
  isInternal: true,
  options: [{
    name: "themebookId",
    description: "themebook Id",
    type: ApplicationCommandOptionTypes.STRING,
    required: true,
  }] as ApplicationCommandOptionData[],
  run: async ({ interaction }) => {
    // try {

    const themebookId: string = getThemebookId(interaction);
    const themebook: ThemebookType = (await graphQL.query({ query: getThemebookByKey(themebookId) })).data.themebook;
    const character = dataService.characters.find(x => x.guildMember === interaction.user.id);
    dataService.themebooksInProgress.push({ "guildMember": interaction.user.id, themebook: themebook });

    let themeboookMessage: MessageEmbed = buildMessage(themebook);
    handleTagQuestions(themebook, themeboookMessage);
    handleIdentityAndTitle(themeboookMessage, themebook);

    const messageActionRow: MessageActionRow = new MessageActionRow()
      .addComponents(
        startButton(themebook, interaction),
        backButton(character, interaction)
      );

    await interaction.channel.messages.edit(interaction.channel.lastMessage, buildThemebookDetailMessage(themeboookMessage, messageActionRow));
    await deferReply(interaction);

    // } catch (error) {
    //   await interaction.reply(error);
    // }
  }
});

function backButton(character: any, interaction: ExtendedInteraction) {
  const operationName = "character";
  dataService.optionsToDeliver.push({
    "guildMember": interaction.user.id,
    "operation": operationName,
    "arguments": [{
      "name": `complete-name`,
      "type": "STRING",
      "value": `${character.name}`,
    },
    {
      "name": `mythos`,
      "type": "STRING",
      "value": `${character.mythos}`,
    },
    {
      "name": `logos`,
      "type": "STRING",
      "value": `${character.logos}`,
    }
    ],
  });
  return new MessageButton()
    .setCustomId(`character_${character.name}&&${character.mythos}&&${character.logos}`)
    .setLabel(`Go Back`)
    .setStyle('SECONDARY');
}

function startButton(themebook: ThemebookType, interaction: ExtendedInteraction) {
  const operationName = "compileThemebook";
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
    .setCustomId(`${operationName}_${themebook.id}`)
    .setLabel(`Start`)
    .setStyle('PRIMARY');
}

function handleIdentityAndTitle(themeboookMessage: MessageEmbed, themebook: ThemebookType) {
  themeboookMessage.addField(`${defineIdentityOrMistery(themebook)} : You can try exploring the following options:`,
    `${themebook.identityMisteryOptions.join('\n')}`, false);

  themeboookMessage.addField(`TITLE EXAMPLES:`, `${themebook.titleExamples.join('\n')}`, true);
}

function buildMessage(themebook: ThemebookType): MessageEmbed {
  return new MessageEmbed()
    .setColor(getThemebookColour(themebook))
    .setTitle(`${themebook.name}`)
    .setDescription(`**${themebook.examplesOfApplication.join(MIDDLE_DOT)}** \n\n ${themebook.description} \n\n `)
    .setFields(
      { name: `CONCEPT: ${themebook.themebookConcept.question}`, value: themebook.themebookConcept?.answers?.join(`\n`) },
      { name: '\u200B', value: '\u200B' }
    );
}


function handleTagQuestions(themebook: ThemebookType, themeboookMessage: MessageEmbed) {
  const powerQuestions = themebook?.tagQuestions?.filter(x => x.type === 0);
  const weaknessQuestions = themebook?.tagQuestions?.filter(x => x.type === 1);
  powerQuestions.forEach(tag => {
    themeboookMessage.addField(`${tag.question}`, `${tag?.answers?.join(MIDDLE_DOT)}`, false);
  });

  addBlankLine(themeboookMessage);

  weaknessQuestions.forEach(tag => {
    themeboookMessage.addField(`${tag.question}`, `${tag?.answers?.join(MIDDLE_DOT)}`, false);
  });
  addBlankLine(themeboookMessage);
}

function addBlankLine(themeboookMessage: MessageEmbed) {
  themeboookMessage.addField('\u200B', '\u200B');
}

function buildThemebookDetailMessage(themeboookMessage: MessageEmbed, messageActionRow: MessageActionRow) {
  return {
    content: "Please read Carefully, when you're ready to press the start button. Otherwise go press back to choose another Themebook.",
    embeds: [themeboookMessage],
    components: [messageActionRow]
  };
}

async function deferReply(interaction: ExtendedInteraction) {
  await interaction.deferReply();
  await interaction.channel.messages.delete(interaction.channel.lastMessage);
}



