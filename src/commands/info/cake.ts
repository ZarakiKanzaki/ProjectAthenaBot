import { Command } from "../../structures/Command";
import { graphQL } from "../..";
import gql from "graphql-tag";


export default new Command({
    name: 'cake',
    description: 'Did you spot the reference??',
    isInternal: false,
    run: async ({ interaction }) => {
        const cake = gql`query {
                            cake
                        }`;
        await graphQL.query({
            query: cake
          }).then(result => {
            interaction.followUp(result.data.cake);
          });        
    }
});