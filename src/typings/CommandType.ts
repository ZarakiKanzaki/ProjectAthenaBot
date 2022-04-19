import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";


interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedInteraction,
    arguments: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any;

export interface ExtendedInteraction extends CommandInteraction{
    member: GuildMember;
}

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;
} & ChatInputApplicationCommandData;