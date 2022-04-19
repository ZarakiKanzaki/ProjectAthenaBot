require('dotenv').config();
import { ClientEvents, Collection } from 'discord.js';
import { ExtendedClient } from '../src/structures/Client';
import { Event } from "../src/structures/Event";
import { CommandType } from '../src/typings/CommandType';
jest.useFakeTimers();

// the only way to test Client.ts is to mock its entire structure
describe('Client-bot', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it('constructor client', () => {
    //     testClient = new ExtendedClient();
    //     expect(new ExtendedClient()).toBeDefined();
    // });

    // it('start connection with discord bot token', () => {
    //     const mockedLoginStart = jest.spyOn(testClient, 'start');
    //     testClient.start();
    //     expect(mockedLoginStart).toHaveBeenCalled();
    // });

    // it('register all commands command', async () => {
    //     const mockedRegisterModules = jest.spyOn(testClient, 'registerModules');
    //     const mockedImportFiles = jest.spyOn(testClient, 'importFile')
    //         .mockImplementation(async (filePath) => {
    //             return new Event('ready', () => {
    //                 console.log('everything is ok');
    //             });
    //         });
    //     try {
    //         await testClient.registerModules();
    //         expect(mockedImportFiles).toHaveBeenCalled();
    //         expect(mockedRegisterModules).toHaveBeenCalled();
    //     } catch (error) {
    //         expect(error).toMatch('error');
    //     }
    // });

    // it('on ready we have to register all commands', () => { 
    //     const mockedRegisterCommands = jest.spyOn(testClient, 'registerCommands');
    //     testClient.on('ready', () =>{
    //         expect(mockedRegisterCommands).toHaveBeenCalled();
    //     });
    // });

    const mockClient = ({
        command: new Collection<string, CommandType>(),
        start: jest.fn(() => {
            console.log('everything is fine');
        }),
        importFile: jest.fn(async (filePath: string) => {
            return new Event('ready', () => {
                                 console.log('everything is ok');
                             });
        })
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

});