import { Command } from "../../structures/Command";
import dataService, { client, graphQL } from "../..";
import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { defineIdentityOrMistery, getThemebookId } from "../../common/Utility";
import { Modal, showModal, TextInputComponent } from "discord-modals";
import { TagQuestionType, ThemebookConceptType, ThemebookType } from "../../typings/ThemebookType";

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

        console.log(themebook);


        let modalThemebook: Modal = getHeadOfModal(character, themebook);

        // handleTagQuestions(themebook, modalThemebook);



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

function getHeadOfModal(character: any, themebook: any): Modal {
    return new Modal()
        .setCustomId(`character_${character.name}&&${character.mythos}&&${character.logos}`)
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
        .setLabel(`${themebook.themebookConcept.question}`)
        .setStyle('SHORT')
        .setPlaceholder(`Write here your concept`)
        .setRequired(true);
}
