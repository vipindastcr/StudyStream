

import { IUserRepository } from "@domain/repositories/IUserRepository"
import {User} from "@domain/entities/User"

export class FindUserByEmail {
    constructor (private userRepo : IUserRepository) { }

    async execute( email :string ) : Promise <User| null> {
        return await this.userRepo.findByEmail( email )
    }
}