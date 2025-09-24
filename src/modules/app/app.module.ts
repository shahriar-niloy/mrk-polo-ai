import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContactModule } from '../contact/contact.module';
import { CampaignModule } from '../campaign/campaign.module';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CommonModule, 
    BullQueueModule, 
    UserModule, 
    AuthModule, 
    ContactModule, 
    CampaignModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
