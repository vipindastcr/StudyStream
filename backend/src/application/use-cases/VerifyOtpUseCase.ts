import { v4 as uuidv4 } from "uuid";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPendingUserRepository } from "../../domain/repositories/IPendingUserRepository";
import { IOtpService } from "../../domain/services/IOtpService";

interface VerifyOtpDTO {
  pendingId?: string;
  email?: string;
  otp: string;
}

export class VerifyOtpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private pendingUserRepository: IPendingUserRepository,
    private otpService: IOtpService
  ) {}

  async execute({ pendingId, email, otp }: VerifyOtpDTO) {
    console.log("VerifyOtpUseCase.execute", { pendingId, email, hasOtp: !!otp });

    if (!otp) {
      throw new Error("OTP is required");
    }

    // STEP 1: Fetch pending user (prefer pendingId, fallback to email)
    let pendingUser = null as Awaited<ReturnType<IPendingUserRepository['findById']>>;
    if (pendingId) {
      pendingUser = await this.pendingUserRepository.findById(pendingId);
    } else if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      pendingUser = await this.pendingUserRepository.findByEmail(normalizedEmail);
    } else {
      throw new Error("Registration identifier (pendingId or email) is required");
    }

    if (!pendingUser) {
      throw new Error("No verification session found. Please register again.");
    }

    // STEP 2: Check OTP expiry
    if (pendingUser.otpExpiresAt.getTime() < Date.now()) {
      await this.pendingUserRepository.deleteById(pendingUser.id);
      throw new Error("OTP expired. Please register again.");
    }

    // STEP 3: Compare OTP
    const isOtpValid = await this.otpService.compareOtp(otp, pendingUser.otpHash);
    console.log("VerifyOtpUseCase.compareOtp", { pendingId: pendingUser.id, isOtpValid });
    if (!isOtpValid) {
      throw new Error("Invalid OTP");
    }

    // STEP 4: Convert PendingUser → User
    const newUser = new User(
      uuidv4(),
      pendingUser.first_name,
      pendingUser.last_name,
      pendingUser.email,
      pendingUser.phone_number,
      pendingUser.passwordHash,
      pendingUser.role,
      pendingUser.createdAt,
      new Date(),
      false,   // isBlocked
      true     // isVerified
    );

    // STEP 5: Save final user
    const savedUser = await this.userRepository.create(newUser);

    // STEP 6: Delete pending user
    await this.pendingUserRepository.deleteById(pendingUser.id);

    // STEP 7: Response
    return {
      success: true,
      message: "Email verified successfully",
      userId: savedUser.id,
      email: savedUser.email,
    };
  }
}
