import { Command } from "../../structures/Command";

export default new Command({
    name: 'ping',
    description: 'replies with pong, test purpouse',
    run: async ({ interaction }) => {
        interaction.followUp('pong');
    }
})