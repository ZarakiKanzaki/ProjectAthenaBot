import gql from "graphql-tag";
import { CharacterType } from "../typings/CharacterType";

export const themebookListQuery = gql`{
    themebooks {
      id,
      name,
      description, 
      examplesOfApplication,
      type {
        name
      }
    }
  }`;

export function getThemebookByKey(themebookId: string) {
  return gql`{
        themebook(themebookId: "${themebookId}") {
          id,
          name,
          description, 
          improvements {
            title,
            decription
          },
          themebookConcept {
            question,
            answers
          },
          examplesOfApplication,
          type {
            name,
            id
          },
          identityMisteryOptions,
          titleExamples,
          crewRelationships,
          tagQuestions {
            question,
            type,
            answers,
          },
        }
      }`;
}

export function createCharacter(character: CharacterType) {
  return gql`mutation{
    createCharacter(
      character: ${convertToGraphQLobject(character)}
    )
  }`;
}

function convertToGraphQLobject(obj: any){
  const objectString = JSON.stringify(obj);
  const grapQLObject = objectString.replace(/"([^(")"]+)":/g,"$1:");
  return grapQLObject;
}