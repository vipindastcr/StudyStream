
import { Router } from "express";
import { UserController} from "@presentation/controllers/UserController";


const router = Router();
const controller = new UserController();


router.post("/register", controller.register);


export default router;