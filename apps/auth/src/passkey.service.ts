import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
} from '@simplewebauthn/server';

@Injectable()
export class PasskeyService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async generateRegistrationOptions(
    userId: string,
  ): Promise<GenerateRegistrationOptionsOpts> {
    const user = await this.userClient
      .send({ cmd: 'getUserById' }, userId)
      .toPromise();

    return generateRegistrationOptions({
      rpName: 'Your App',
      rpID: process.env.RP_ID,
      userID: user.userId,
      userName: user.email,
      attestationType: 'none',
      authenticatorSelection: {
        userVerification: 'preferred',
        residentKey: 'required',
      },
    });
  }

  async verifyRegistration(userId: string, credential: any): Promise<boolean> {
    const user = await this.userClient
      .send({ cmd: 'getUserById' }, userId)
      .toPromise();

    try {
      const verification = await verifyRegistrationResponse({
        credential,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: process.env.EXPECTED_ORIGIN,
        expectedRPID: process.env.RP_ID,
      });

      if (verification.verified) {
        await this.userClient
          .send(
            { cmd: 'updateUser' },
            {
              userId,
              passkey: JSON.stringify(verification.registrationInfo),
            },
          )
          .toPromise();
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  async generateAuthenticationOptions(
    userId: string,
  ): Promise<GenerateAuthenticationOptionsOpts> {
    const user = await this.userClient
      .send({ cmd: 'getUserById' }, userId)
      .toPromise();

    return generateAuthenticationOptions({
      rpID: process.env.RP_ID,
      allowCredentials: [JSON.parse(user.passkey)],
      userVerification: 'preferred',
    });
  }

  async verifyAuthentication(userId: string, credential: any): Promise<any> {
    const user = await this.userClient
      .send({ cmd: 'getUserById' }, userId)
      .toPromise();

    try {
      const verification = await verifyAuthenticationResponse({
        credential,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: process.env.EXPECTED_ORIGIN,
        expectedRPID: process.env.RP_ID,
        authenticator: JSON.parse(user.passkey),
      });

      if (verification.verified) {
        return this.generateToken(user);
      }
    } catch (error) {
      console.error(error);
    }

    throw new Error('Authentication failed');
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
