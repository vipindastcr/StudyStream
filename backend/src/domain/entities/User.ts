

export enum UserRole {
    USER = 'user',
    TUTOR = 'tutor',
    ADMIN = 'admin'
}

export class User {
  constructor(
    public id: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public phone_number: string,
    public passwordHash: string,
    public role: UserRole,
    public created_at: Date,
    public last_login: Date,
    public isBlocked: boolean
  ) {}
}

