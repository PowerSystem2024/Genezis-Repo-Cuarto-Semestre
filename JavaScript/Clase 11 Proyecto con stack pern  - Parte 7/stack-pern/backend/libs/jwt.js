import jwt from "jsonwebtoken";
// MODIFICADO: Cambiamos de "./config.js" a "../config.js"
import { JWT_SECRET } from "../config.js"; 

export const createAccessToken = (paylod) => {
    return new Promise((resolve, reject) => {
        jwt.sign(paylod, JWT_SECRET, { expiresIn: "1d" },
        (err, token) => {
            if (err) reject(err);
            resolve(token);
    });
    });
};