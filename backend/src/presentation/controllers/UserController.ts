

import {Request, Response} from "express"
import { UserRepositoryImpl} from "@infrastructure/repositories/UserRepositoryImpl"
import {RegisterUserUseCase} from "@application/use-cases/RegisterUserUseCase"


export class UserController {
    private userRepo = new UserRepositoryImpl();
    private createUser = new RegisterUserUseCase( this.userRepo )

    register = async ( req: Request, res: Response) => {
        try {
             const user = await this.createUser.execute(req.body)
             res.status(201).json(user)
        } catch (error) {
            res.status(500).json({message: "Internal server error"})
        }
    }
}
