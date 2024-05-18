import decrypt from "./decrypt.js";
import createClients from "./createClients.js"
import getDB  from './getDB.js';
import getContent from "./getContent.js";

export const onPreBuild = async() => {
    const credentials = decrypt(process.env)
    const clients = await createClients(credentials)

    const [db, content] = await Promise.all([
        getDB(clients, process.env),
        getContent(clients, process.env)
    ])
}