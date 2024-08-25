import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class TOTPService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  async setupTOTP(userId: string) {
    const secret = speakeasy.generateSecret();
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: 'Your App',
      issuer: 'Your Company',
    });
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    const encryptedSecret = this.encrypt(secret.base32);
    await this.userClient
      .send({ cmd: 'updateUser' }, { userId, totpSecret: encryptedSecret })
      .toPromise();

    const recoveryCodes = this.generateRecoveryCodes();
    const hashedRecoveryCodes = recoveryCodes.map((code) =>
      crypto.createHash('sha256').update(code).digest('hex'),
    );
    await this.userClient
      .send(
        { cmd: 'updateUser' },
        { userId, totpRecoveryCodes: hashedRecoveryCodes },
      )
      .toPromise();

    return { qrCodeDataUrl, recoveryCodes };
  }

  async verifyTOTP(userId: string, token: string) {
    const user = await this.userClient
      .send({ cmd: 'getUserById' }, userId)
      .toPromise();
    const decryptedSecret = this.decrypt(user.totpSecret);
    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token,
    });
    if (verified) {
      await this.userClient
        .send({ cmd: 'updateUser' }, { userId, totpVerified: true })
        .toPromise();
    }
    return verified;
  }

  private generateRecoveryCodes(): string[] {
    return Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex'),
    );
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
