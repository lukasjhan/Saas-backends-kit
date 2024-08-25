import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { PasswordAuthService } from './password.service';
import { PasswordlessAuthService } from './passwordless.service';
import { GithubOAuthService } from './github.oauth.service';
import { TOTPService } from './totp.service';
import { PasskeyService } from './passkey.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST,
          port: parseInt(process.env.USER_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    PasswordAuthService,
    PasswordlessAuthService,
    GithubOAuthService,
    TOTPService,
    PasskeyService,
  ],
})
export class AuthModule {}
