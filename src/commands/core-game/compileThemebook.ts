import { Command } from "../../structures/Command";
import dataService, { client, graphQL } from "../..";
import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { defineIdentityOrMistery, getThemebookId } from "../../common/Utility";
import { Modal, showModal, TextInputComponent } from "discord-modals";
import { TagQuestionType, ThemebookType } from "../../typings/ThemebookType";
import { ExtendedInteraction } from "../../typings/CommandType";

const MIDDLE_DOT = ' · ';

export default new Command({
    name: 'compileThemebook',
    description: 'Time to compile your character themebook',
    isInternal: true,
    options: [{
        name: "themebookId",
        description: "themebook Id",
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
    }] as ApplicationCommandOptionData[],
    run: async ({ interaction }) => {

        const themebookId: string = getThemebookId(interaction);
        const themebook: ThemebookType = dataService.themebooksInProgress.find(x => x.guildMember === interaction.user.id && x.themebook.id === themebookId).themebook;
        const character = dataService.characters.find(x => x.guildMember === interaction.user.id);

        let modalThemebook: Modal = getHeadOfModal(character, themebook, interaction);

        // handleTagQuestions(themebook, modalThemebook);

        modalThemebook.addComponents(concatPowerTags());
        modalThemebook.addComponents(concatWeaknessTags());

        modalThemebook.addComponents(identityMisteryText(themebook));
        modalThemebook.addComponents(titleText);


        showModal(modalThemebook, {
            client: client,
            interaction: interaction
        });
    }
});


const titleText = new TextInputComponent()
    .setCustomId('title')
    .setLabel(`TITLE`)
    .setStyle('SHORT')
    .setPlaceholder(`TITLE`)
    .setRequired(true);

function concatWeaknessTags(): TextInputComponent {
    return new TextInputComponent()
        .setCustomId('weaknessTagQuestions')
        .setLabel(`Weakness Tag`)
        .setStyle('SHORT')
        .setPlaceholder(`your weakness tag`)
        .setRequired(true);
}
    

function concatPowerTags(): TextInputComponent {
    return new TextInputComponent()
        .setCustomId('powerTagQuestions')
        .setLabel(`Power Tag`)
        .setStyle('SHORT')
        .setPlaceholder(`Remember to separate each answer with an && symbol`)
        .setRequired(true);
}

function getHeadOfModal(character: any, themebook: any, interaction: ExtendedInteraction): Modal {
    const operationName = `character_${character.name}&&${character.mythos}&&${character.logos}`;
    dataService.optionsToDeliver.push({
      "guildMember": interaction.user.id,
      "operation": operationName,
      "arguments": [
        {
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
    return new Modal()
        .setCustomId(operationName)
        .setTitle(`${themebook.name}`)
        .addComponents(conceptQuestion(themebook));
}

function handleTagQuestions(themebook: any, modalThemebook: Modal) {
    const powerQuestions: TagQuestionType[] = themebook?.tagQuestions?.filter(x => x.type === 0);
    const weaknessQuestions: TagQuestionType[] = themebook?.tagQuestions?.filter(x => x.type === 1);
    let index: number = 0;
    powerQuestions.forEach(tag => {
        modalThemebook.addComponents(textForPowerTag(index, tag));
        index++;
    });

    index = 0;

    weaknessQuestions.forEach(tag => {
        modalThemebook.addComponents(textForWeaknessTag(index, tag));
        index++;
    });
}

function identityMisteryText(themebook: ThemebookType): TextInputComponent {
    return new TextInputComponent()
        .setCustomId('identityMistery')
        .setLabel(`${defineIdentityOrMistery(themebook)}`)
        .setStyle('SHORT')
        .setPlaceholder(`Write here your ${defineIdentityOrMistery(themebook)}`)
        .setRequired(true);
}

function textForWeaknessTag(index: number, tag: TagQuestionType): TextInputComponent {
    return new TextInputComponent()
        .setCustomId(`weaknesstag-${index}`)
        .setLabel(`${tag.question}`)
        .setStyle('SHORT')
        .setPlaceholder(`${tag?.answers.join(MIDDLE_DOT)}`)
        .setRequired(true);
}


function textForPowerTag(index: number, tag: TagQuestionType): TextInputComponent {
    return new TextInputComponent()
        .setCustomId(`powertag-${index}`)
        .setLabel(`${tag.question}`)
        .setStyle('SHORT')
        .setPlaceholder(`${tag?.answers.join(MIDDLE_DOT)}`)
        .setRequired(true);
}

function conceptQuestion(themebook: ThemebookType): TextInputComponent {
    return new TextInputComponent()
        .setCustomId('concept')
        .setLabel(`CONCEPT`)
        .setStyle('SHORT')
        .setPlaceholder(`Write here your concept`)
        .setRequired(true);
}
