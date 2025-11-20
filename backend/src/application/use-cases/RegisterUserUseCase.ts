
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class RegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: User): Promise<User> {
    return this.userRepo.create(data);
  }
}
