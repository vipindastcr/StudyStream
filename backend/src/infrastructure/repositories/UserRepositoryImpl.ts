import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { UserModel } from "@infrastructure/models/UserModel";


export class UserRepositoryImpl implements IUserRepository {

  private toEntity(doc: any): User {
    if (!doc) return null as any;

    return new User(
      doc._id.toString(),
      doc.first_name,
      doc.last_name,
      doc.email,
      doc.phone_number,
      doc.passwordHash,
      doc.role,
      doc.created_at,
      doc.last_login,
      doc.isBlocked
    );
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      passwordHash: user.passwordHash,
      role: user.role,
      created_at: user.created_at,
      last_login: user.last_login,
      isBlocked: user.isBlocked
    });

    return this.toEntity(created.toObject());
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    return doc ? this.toEntity(doc) : null;
  }
}
