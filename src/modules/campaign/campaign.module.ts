import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignService } from './campaign.service';
import { BullModule } from '@nestjs/bull';
import { CampaignStepConsumer } from './consumer/campaign-step.consumer';
import { CampaignController } from './campaign.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign]),
        BullModule.registerQueue({ name: 'campaignStepExecutions' }),
    ],
    providers: [CampaignService, CampaignStepConsumer],
    controllers: [CampaignController],
    exports: [CampaignService],
})
export class CampaignModule {}
