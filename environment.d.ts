declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            environtment: "dev" | "prod" | "debug";
            athenaBackend: string;
        }
    }
}

export {};