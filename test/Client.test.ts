require('dotenv').config();
import { ClientEvents, Collection } from 'discord.js';
import { ExtendedClient } from '../src/structures/Client';
import { Event } from "../src/structures/Event";
import { Command } from "../src/structures/Command";
import { CommandType } from '../src/typings/CommandType';
jest.useFakeTimers();

// the only way to test Client.ts is to mock its entire structure
describe('Client-bot', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockClient = ({
        commands: new Collection<string, CommandType>(),
        start: jest.fn(() => {
            console.log('everything is fine');
        }),
        importFile: jest.fn(async (filePath: string) => {

            if(filePath.indexOf('event') >= 0){
                return new Event('ready', () => {
                    console.log('everything is ok');
                });
            }
            else
            {
                return new Command({
                    name: 'ping',
                    description: 'replies with pong, test purpouse',
                    run: async ({ interaction }) => {
                        console.log('pong');
                    }
                });
            }
        }),
    } as unknown) as ExtendedClient;

    it('should start be called once', () => {
        mockClient.start();
        expect(mockClient.start).toHaveBeenCalled();
    });

    it('should import events from filepath a receive an Event', async () => {
        const mockedImport: Event<keyof ClientEvents> = await mockClient.importFile('event_file_Path');
        console.log(mockedImport);
        expect(mockedImport.event).toBe('ready');
    });

    it('should register commands by taking from filepaths', async ()=> {
        const mockedImport: CommandType = await mockClient.importFile('command_file_Path');

    });

});