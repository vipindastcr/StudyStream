import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../../domain/entities/User";
import { PendingUser } from "../../domain/entities/PendingUser";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPendingUserRepository } from "../../domain/repositories/IPendingUserRepository";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { IOtpService } from "../../domain/services/IOtpService";
import validator from "validator";

interface RegisterUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role?: UserRole | string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private pendingUserRepository: IPendingUserRepository,
    private passwordService: IPasswordService,
    private otpService: IOtpService
  ) {}

  async execute(userData: RegisterUserDTO) {
    const normalizedEmail = userData.email.trim().toLowerCase();

    // Check duplicate email
    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new Error("Email already exists");
    }

    if (!validator.isEmail(normalizedEmail)) {
      throw new Error("Please provide a valid email address");
    }

    const existingPending = await this.pendingUserRepository.findByEmail(
      normalizedEmail
    );
    if (existingPending) {
      await this.pendingUserRepository.deleteById(existingPending.id);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      userData.password
    );

    const role =
      userData.role && userData.role.toString().toLowerCase() === UserRole.TUTOR
        ? UserRole.TUTOR
        : UserRole.USER;

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const pendingUser = new PendingUser(
      uuidv4(),
      userData.first_name,
      userData.last_name,
      normalizedEmail,
      userData.phone_number,
      hashedPassword,
      role,
      otpHash,
      expiresAt,
      new Date()
    );

    const savedPending = await this.pendingUserRepository.create(pendingUser);

    await this.otpService.sendOtp(normalizedEmail, otp);

    return {
      success: true,
      message: "OTP sent to your email",
      email: normalizedEmail,
      pendingId: savedPending.id
    };
  }
}
