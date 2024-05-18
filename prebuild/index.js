import decrypt from "./decrypt.js";
import createClients from "./createClients.js"
import getDB  from './getDB.js';

export const onPreBuild = async() => {
    const credentials = decrypt(process.env)
    const clients = await createClients(credentials)

    const db = await getDB(clients, process.env)
}