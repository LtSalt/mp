import decrypt from "./decrypt.js";

export const onPreBuild = async() => {
    const credentials = decrypt(process.env)
}