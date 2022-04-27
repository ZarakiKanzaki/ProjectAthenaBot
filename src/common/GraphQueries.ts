import gql from "graphql-tag";

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

export function getThemebookByKey(themebookId:string) {
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
            name
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