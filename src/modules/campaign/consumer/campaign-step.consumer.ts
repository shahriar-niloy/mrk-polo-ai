import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { CampaignService } from '../campaign.service';
import { CAMPAIGN_STEP_EXECUTION_JOB_NAME, CAMPAIGN_STEP_EXECUTION_QUEUE } from 'src/constants';

@Processor(CAMPAIGN_STEP_EXECUTION_QUEUE)
export class CampaignStepConsumer {
    constructor(private readonly campaignService: CampaignService) {}

    @Process(CAMPAIGN_STEP_EXECUTION_JOB_NAME)
    async handleJob(job: Job<{ campaignId: number; stepIndex: number }>) {
        await this.campaignService.executeWorkflowStep(job.data.campaignId);
        return { success: true };
    }

    @OnQueueFailed()
    onError(job: Job, error: Error) {
        console.error(`Job ${job.id} failed with error:`, error);
    }
}
