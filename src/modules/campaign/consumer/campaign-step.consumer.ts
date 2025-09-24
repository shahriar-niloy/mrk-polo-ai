import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { CampaignService } from '../campaign.service';

@Processor('campaignStepExecutions')
export class CampaignStepConsumer {
    constructor(private readonly campaignService: CampaignService) {}

    @Process(`campaign-step-execution`)
    async handleJob(job: Job<{ campaignId: number; stepIndex: number }>) {
        await this.campaignService.executeWorkflowStep(job.data.campaignId);
        return { success: true };
    }

    @OnQueueFailed()
    onError(job: Job, error: Error) {
        console.error(`Job ${job.id} failed with error:`, error);
    }
}
