import * as fsPromises from "fs/promises";
import * as path from "path";
import decrypt from "./decrypt.js";
import createClients from "./createClients.js"
import getDB  from './getDB.js';
import getContent from "./getContent.js";

export const onPreBuild = async() => {
    try {
        const credentials = decrypt(process.env)
        const clients = await createClients(credentials)
        
        const [db, content] = await Promise.all([
            getDB(clients, process.env),
            getContent(clients, process.env)
        ])
        
        const pathDir = path.join(process.cwd(), 'static', 'data')
        const pathDB = path.join(process.cwd(), 'static', "data", "db.json") 
        const pathContent = path.join(process.cwd(), 'static', "data", "content.json") 

        await fsPromises.mkdir(pathDir)
        await Promise.all([
            fsPromises.writeFile(pathDB, JSON.stringify(db)),
            fsPromises.writeFile(pathContent, JSON.stringify(content))
        ])
    } catch(err) {
        console.error(err)
    }
}