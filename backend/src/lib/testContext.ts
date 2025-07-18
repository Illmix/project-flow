import {IncomingMessage} from "http";
import {createContext} from "../context.js";

export const buildContext = async (headers?: IncomingMessage['headers']) => {
    const req = { headers } as IncomingMessage;
    return await createContext({ req });
};