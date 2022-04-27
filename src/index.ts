require('dotenv').config();
import ApolloClient from 'apollo-boost';
import { ExtendedClient } from "./structures/Client";

import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import discordModals from 'discord-modals';
import DataService from './structures/DataService';

const opts = {uri: process.env.athenaBackend, fetch: fetch};
const link = createHttpLink(opts);

export const client = new ExtendedClient();
export const graphQL = new ApolloClient(opts);
const dataService = DataService.getInstance();

Object.freeze(dataService);
export default dataService;

discordModals(client);

client.start();