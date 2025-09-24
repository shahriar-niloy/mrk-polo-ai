import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'defaultSecret'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION', '60s') },
            }),
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [AuthService],
    exports: [JwtModule]
})
export class AuthModule { }
