import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Intents } from "discord.js";
import { CommandType } from "../typings/CommandType";
import { glob } from "glob";
import { promisify } from "util";
import { isNullOrEmpty, isNullOrUndefined } from "../common/Utility";
import { RegisterCommandOptions } from "../typings/RegisterCommandOptions";
import { Event } from "./Event";

const promise = promisify(glob);
const DIRECTORY_OF_COMMANDS = `${__dirname}/../commands/**/*{.ts,.js}`;
const DIRECTORY_OF_EVENTS = `${__dirname}/../events/*{.ts,.js}`;

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        const ALL_INTENTS = new Intents(32767);
        super({ intents: ALL_INTENTS });
    }

    start() {
        this.commands = new Collection();
        this.registerModules();
        this.login(process.env.botToken);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        }
        else {
            this.application?.commands.set(commands);
            console.log(`Registering global Commands`);
        }
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await promise(DIRECTORY_OF_COMMANDS);
        const eventFiles = await promise(DIRECTORY_OF_EVENTS);

        this.importAndSetupCommands(commandFiles, slashCommands);

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });
        this.importAndRunEvents(eventFiles);
    }



    private importAndRunEvents(eventFiles: string[]) {
        eventFiles.forEach(async (filePath) => {
            console.log(filePath);
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);

            console.log(event);
            
            if (isNullOrUndefined(event)) {
                return;
            }
            this.on(event.event, event.run);
        });
    }

    private importAndSetupCommands(commandFiles: string[], slashCommands: ApplicationCommandDataResolvable[]) {
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);

            if (isNullOrEmpty(command.name)) {
                return;
            }

            console.log(command);

            this.commands.set(command.name, command);
            if (command.isInternal === false && slashCommands.some(a => a.name === command.name) === false) {
                slashCommands.push(command);
            }
        });
    }
}