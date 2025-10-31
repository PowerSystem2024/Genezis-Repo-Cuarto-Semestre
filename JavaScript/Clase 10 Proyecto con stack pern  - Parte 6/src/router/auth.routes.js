import { Router } from "express";
import { porfile, signin, signout, signup } from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/authmiddleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js"
import { signupSchema, signinSchema } from "../schemas/auth.schema.js";

const router =  Router();

router.get('/tareas', isAuth, listarTareas);

router.get('/tareas/:id', isAuth, listarTarea);

router.post("/signin", isAuth, validateSchema(signinSchema), signin);

router.post("/signup", isAuth, validateSchema(signupSchema), signup);

router.post("/sigout", isAuth, signout);

router.get("/porfile", isAuth, porfile);

export default router;