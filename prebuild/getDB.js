import { wasteTypes } from "./wasteTypes.js";

export default async function getDB(clients, env) {
    const { sheets, drive } = clients;
    const { SHEET_ID, IMG_ID, PDF_ID } = env;

    const data = await getData(sheets, SHEET_ID);
    const db = await addLinks(data, drive, IMG_ID, PDF_ID);
    
    return db
}

async function getData(client, sheetID) {
    const res = await client.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: "Sheet1",
        valueRenderOption: 'UNFORMATTED_VALUE'
    });
    const sheet = res.data.values;
    const data = bin(transform(sheet));
    return data
}

// Snippet from: https://stackoverflow.com/questions/75687054/whats-the-best-way-to-transform-google-sheets-data-to-an-array-of-objects
function transform(array) {
    const fieldNames = array[0];
    const reducer = (soFar, value, fieldIndex) => {
        soFar[fieldNames[fieldIndex]] = value;
        return soFar
    }
    return array.slice(1).map((row) => {
        return row.reduce(reducer, {})
    });
}

function bin(array) {
    return array.map((row) => {
		const otherVars = [];
		const abfallarten = [];

		Object.entries(row).forEach(([key, value]) => {
			if (!wasteTypes.includes(key)) otherVars.push([key, value]);
			if (wasteTypes.includes(key) && value) abfallarten.push(key);
		});

		return { ...Object.fromEntries(otherVars), abfallarten };
	});
}

async function addLinks(data, client, imgID, pdfID) {
    const [imgLinks, pdfLinks] = await Promise.all([
        getLinks(client, imgID, 'https://lh3.googleusercontent.com/d/'), 
        getLinks(client, pdfID, 'https://drive.google.com/file/d/')
    ]);
    
    const withLinks = data.map(row => {
        const imgLink = imgLinks.get(row.id);
        const pdfLink = pdfLinks.get(row.id);
        return { ...row, imgLink, pdfLink }
    })
    
    return withLinks
}

async function getLinks(client, id, prefix) {
    const res = await client.files.list({
        q: `'${id}' in parents`,
        fields: 'files(id, name)'
    })

    const links = new Map();
    res.data.files.forEach(file => {
        const id = Number(file.name.match(/(?<id>\d+)\.\w{3}/).groups.id);
        const link = `${prefix}${file.id}`;
        links.set(id, link)
    })

    return links;
}