import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class PasswordlessAuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async generateCode(email: string) {
    const code = crypto.randomBytes(3).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store the code securely (e.g., in Redis)
    // For demonstration, we'll just log it
    console.log(`Code for ${email}: ${code}`);

    return { message: 'Passwordless code sent' };
  }

  async verifyCode(email: string, code: string) {
    // Verify the code (in a real scenario, check against stored code)
    // For demonstration, we'll just check if it's 6 characters
    if (code.length !== 6) {
      throw new Error('Invalid code');
    }

    const user = await this.userClient
      .send({ cmd: 'getUserByEmail' }, email)
      .toPromise();
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
