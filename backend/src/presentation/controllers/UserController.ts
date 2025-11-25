import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../application/use-cases/VerifyOtpUseCase';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { PendingUserRepositoryImpl } from '../../infrastructure/repositories/PendingUserRepositoryImpl';
import { BcryptPasswordService } from '../../infrastructure/services/BcryptPasswordService';
import { OtpServiceImpl } from '../../infrastructure/services/OtpServiceImpl';

export class UserController {

    // Repositories + Services
    private userRepo = new UserRepositoryImpl();
    private pendingUserRepo = new PendingUserRepositoryImpl();
    private passwordService = new BcryptPasswordService();
    private otpService = new OtpServiceImpl();

    // Use Cases
    private registerUserUseCase = new RegisterUserUseCase(
        this.userRepo,
        this.pendingUserRepo,
        this.passwordService,
        this.otpService
    );

    private verifyOtpUseCase = new VerifyOtpUseCase(
        this.userRepo,
        this.pendingUserRepo,
        this.otpService
    );

    // ---------------- REGISTER -------------------
    register = async (req: Request, res: Response) => {
        try {
            const result = await this.registerUserUseCase.execute(req.body);
            return res.status(201).json(result);
        } catch (error) {
            const err = error as any;
            return res.status(400).json({ error: err.message });
        }
    };

    // ---------------- VERIFY OTP -------------------
    verifyOtp = async (req: Request, res: Response) => {
        console.log("verifyotp function-------");

        try {
            console.log("POST /api/users/verify-otp body:", req.body);
            const result = await this.verifyOtpUseCase.execute(req.body);
            return res.status(200).json(result);
        } catch (error) {
            const err = error as any;
            console.error("Error verifying OTP:", err.message);
            return res.status(400).json({ error: err.message });
        }
    };
}
