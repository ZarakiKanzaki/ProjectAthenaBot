import dataService, { client, graphQL } from "..";
import { ThemebookType } from "../typings/ThemebookType";
import { v4 as uuidv4 } from 'uuid';
import { redirectToCommand } from "../common/Utility";
import { createCharacter } from "../common/GraphQueries";
import { CharacterThemebookTagType, CharacterThemebookType, CharacterType, TagType } from "../typings/CharacterType";
const util = require('util');
const QUESTION_SEPARATOR = '&&';

client.on('modalSubmit', async (interaction) => {
    const themebook: ThemebookType = dataService.themebooksInProgress.find(x => x.guildMember === interaction.user.id).themebook;
    let character: CharacterType = dataService.characters.find(x => x.guildMember === interaction.user.id);

    const title = interaction.getTextInputValue('title');
    const concept = interaction.getTextInputValue('concept');
    const identityMistery = interaction.getTextInputValue('identityMistery');
    const powerTagAnswers = interaction.getTextInputValue('powerTagQuestions').split(QUESTION_SEPARATOR);
    const weaknessTagAnswers = interaction.getTextInputValue('weaknessTagQuestions').split(QUESTION_SEPARATOR);

    let powerTags = [];
    let weaknessTags = [];
    let characterThemebook = {
        "title": title,
        "concept": concept,
        "identityMistery": identityMistery,
        "typeId": themebook.type.id,
        "themebookId": themebook.id,
        "flipside": '',
        "fadeCrackLevel": 0,
        "attentionLevel": 0,
        "tags": [],
    } as CharacterThemebookType;

    handleTags(powerTagAnswers, powerTags, characterThemebook, themebook, weaknessTagAnswers, weaknessTags, character);
    character.themebooks.push(characterThemebook);

    dataService.removeThemebookInProgress(themebook);

    if (character.themebooks.length === 4) {
        try {
            await submitCreateCharacter(character, interaction);
        } catch (error) {
            interaction.reply(`${error}`);
        }
    }
    else {
        redirectToCommand(interaction);
    }
});

async function submitCreateCharacter(character: CharacterType, interaction) {
    await graphQL.mutate({mutation: createCharacter(character)});

    interaction.reply(`The character ${character.name} has been created.`);
}

function handleTags(powerTagAnswers: string[], powerTags: any[], characterThemebook: CharacterThemebookType, themebook: ThemebookType, weaknessTagAnswers: string[], weaknessTags: any[], character: CharacterType) {
    powerTagAnswers.forEach(answer => {
        const answerId = uuidv4();
        powerTags.push(buildPowerTag(answerId, answer));
        characterThemebook.tags.push(buildCharacterThemebookTag(themebook, answerId, answer));
    });

    weaknessTagAnswers.forEach(answer => {
        const answerId = uuidv4();
        weaknessTags.push(buildWeaknessTag(answerId, answer));
        characterThemebook.tags.push(buildCharacterThemebookTag(themebook, answerId, answer));
    });

    character.tags.push(...powerTags);
    character.tags.push(...weaknessTags);
}

function buildWeaknessTag(answerId: any, answer: string): TagType {
    return {
        "id": answerId,
        "type": 1,
        "name": answer,
        "level": 1,
        "isSubtractive": true,
    };
}

function buildCharacterThemebookTag(themebook: ThemebookType, answerId: any, answer: string): CharacterThemebookTagType {
    return {
        "characterThemebookId": themebook.id,
        "tagId": answerId,
        "tagName": answer,
    };
}

function buildPowerTag(answerId: any, answer: string): TagType {
    return {
        "id": answerId,
        "type": 0,
        "name": answer,
        "level": 1,
        "isSubtractive": false,
    };
}
