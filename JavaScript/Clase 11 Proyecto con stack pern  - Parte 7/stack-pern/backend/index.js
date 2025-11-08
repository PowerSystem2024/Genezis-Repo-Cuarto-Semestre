import './loadEnv.js'; // <-- IMPORTA Y EJECUTA ESTO PRIMERO

// Ahora, el resto de tus importaciones usarán las variables correctas
import app from "./app.js";
import { PORT } from "./config.js";

app.listen(PORT);

console.log("Server on port", PORT);