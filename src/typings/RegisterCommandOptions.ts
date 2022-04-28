import { ApplicationCommandData, ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandOptions{
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}