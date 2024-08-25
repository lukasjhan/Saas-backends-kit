import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PasswordAuthService } from './password.service';
import { PasswordlessAuthService } from './passwordless.service';
import { GithubOAuthService } from './github.oauth.service';
import { TOTPService } from './totp.service';
import { PasskeyService } from './passkey.service';

@Controller()
export class AuthController {
  constructor(
    private readonly passwordAuthService: PasswordAuthService,
    private readonly passwordlessAuthService: PasswordlessAuthService,
    private readonly githubOAuthService: GithubOAuthService,
    private readonly totpService: TOTPService,
    private readonly passkeyService: PasskeyService,
  ) {}

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() data: { email: string; password: string }) {
    return this.passwordAuthService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() data: { email: string; password: string }) {
    return this.passwordAuthService.register(data.email, data.password);
  }

  @MessagePattern({ cmd: 'auth.generatePasswordlessCode' })
  generatePasswordlessCode(@Payload() email: string) {
    return this.passwordlessAuthService.generateCode(email);
  }

  @MessagePattern({ cmd: 'verifyPasswordlessCode' })
  verifyPasswordlessCode(@Payload() data: { email: string; code: string }) {
    return this.passwordlessAuthService.verifyCode(data.email, data.code);
  }

  @MessagePattern({ cmd: 'auth.initiateGithubOAuth' })
  initiateGithubOAuth() {
    return this.githubOAuthService.initiateOAuth();
  }

  @MessagePattern({ cmd: 'auth.handleGithubCallback' })
  handleGithubCallback(@Payload() code: string) {
    return this.githubOAuthService.handleCallback(code);
  }

  @MessagePattern({ cmd: 'auth.setupTOTP' })
  setupTOTP(@Payload() userId: string) {
    return this.totpService.setupTOTP(userId);
  }

  @MessagePattern({ cmd: 'auth.verifyTOTP' })
  verifyTOTP(@Payload() data: { userId: string; token: string }) {
    return this.totpService.verifyTOTP(data.userId, data.token);
  }

  @MessagePattern({ cmd: 'auth.generateRegistrationOptions' })
  generateRegistrationOptions(@Payload() userId: string) {
    return this.passkeyService.generateRegistrationOptions(userId);
  }

  @MessagePattern({ cmd: 'verifyRegistration' })
  verifyRegistration(@Payload() data: { userId: string; credential: any }) {
    return this.passkeyService.verifyRegistration(data.userId, data.credential);
  }

  @MessagePattern({ cmd: 'auth.generateAuthenticationOptions' })
  generateAuthenticationOptions(@Payload() userId: string) {
    return this.passkeyService.generateAuthenticationOptions(userId);
  }

  @MessagePattern({ cmd: 'auth.verifyAuthentication' })
  verifyAuthentication(@Payload() data: { userId: string; credential: any }) {
    return this.passkeyService.verifyAuthentication(
      data.userId,
      data.credential,
    );
  }
}
