import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construimos la ruta absoluta al archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, './.env');

// Cargamos el archivo .env desde esa ruta específica
dotenv.config({ path: envPath });

console.log(`[dotenv] Variables de entorno cargadas desde: ${envPath}`);
console.log(`[dotenv] DB leída: ${process.env.PG_DATABASE}`);