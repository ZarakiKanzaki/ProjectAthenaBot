import { Event } from "../structures/Event";

export default new Event('ready', () => {
    console.log('Athena is Online');
})