import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignService } from './campaign.service';
import { BullModule } from '@nestjs/bull';
import { CampaignStepConsumer } from './consumer/campaign-step.consumer';
import { CampaignController } from './campaign.controller';
import { CAMPAIGN_STEP_EXECUTION_QUEUE } from 'src/constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign]),
        BullModule.registerQueue({ name: CAMPAIGN_STEP_EXECUTION_QUEUE }),
    ],
    providers: [CampaignService, CampaignStepConsumer],
    controllers: [CampaignController],
    exports: [CampaignService],
})
export class CampaignModule {}
