import { Router } from "express";
import { actualizarTarea, crearTarea, eliminarTarea, listarTarea, listarTareas } from "../controllers/tareas.controller.js";
import { isAuth } from "../middlewares/authmiddleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createTareasSchema, updateTareasSchema } from "../schemas/tarea.schema.js";

const router = Router();

router.get("/tareas", isAuth, listarTareas);

router.get('/tareas/:id', isAuth, listarTarea);

router.post('/tareas', validateSchema(createTareasSchema), crearTarea );

router.put('/tareas/:id', validateSchema(updateTareasSchema), actualizarTarea );

router.delete('/tareas/:id', isAuth, eliminarTarea );

export default router;