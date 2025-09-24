import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from './campaign.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { CreateCampaignDto } from './dto';
import { CAMPAIGN_STEP_EXECUTION_JOB_NAME, CAMPAIGN_STEP_EXECUTION_QUEUE } from 'src/constants';

@Injectable()
export class CampaignService {
    constructor(
        @InjectRepository(Campaign)
        private campaignRepository: Repository<Campaign>,
        @InjectQueue(CAMPAIGN_STEP_EXECUTION_QUEUE) private campaignStepExecutionQueue: Queue,
    ) {
        
    }

    async getCampaign(id: number): Promise<Campaign | null> {
        if (!id) throw new BadRequestException('ID is required');
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        if (!campaign) throw new NotFoundException('Campaign not found');
        return campaign;
    }

    async getCampaignList(): Promise<Campaign[]> {
        return this.campaignRepository.find();
    }

    async createCampaign(campaignData: CreateCampaignDto): Promise<Campaign> {
        const campaign = this.campaignRepository.create(campaignData);
        await this.campaignRepository.save(campaign);
        return campaign;
    }

    async updateCampaign(id: number, campaignData: Partial<Campaign>): Promise<Campaign | null> {
        if (!id) throw new BadRequestException('ID is required');
        const existingCampaign = await this.campaignRepository.findOne({ where: { id } });
        if (!existingCampaign) throw new NotFoundException('Campaign not found');
        this.campaignRepository.merge(existingCampaign, campaignData);
        await this.campaignRepository.save(existingCampaign);
        return existingCampaign;
    }

    async deleteCampaign(id: number): Promise<void> {
        if (!id) throw new BadRequestException('ID is required');
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        if (!campaign) throw new NotFoundException('Campaign not found');
        await this.campaignRepository.remove(campaign);
    }

    async updateCampaignStatus(id: number, status: CampaignStatus): Promise<Campaign | null> {
        if (!id) throw new BadRequestException('ID is required');
        const campaign = await this.campaignRepository.findOne({ where: { id } });

        if (!campaign) throw new NotFoundException('Campaign not found');
        
        if (status === CampaignStatus.PAUSED) {
            await this.pauseCampaign(campaign);
        } else if (status === CampaignStatus.LAUNCHED) {
            await this.launchCampaign(campaign);
        } else {
            throw new BadRequestException('Invalid status transition');
        }

        return campaign;
    }

    async pauseCampaign(campaign: Campaign) {
        if (!campaign) throw new BadRequestException('Campaign is required');
        
        if (campaign.status !== CampaignStatus.LAUNCHED) {
            throw new BadRequestException('Campaign is not launched thus cannot be paused');
        }

        campaign.status = CampaignStatus.PAUSED;
        await this.campaignRepository.save(campaign);
    }

    async launchCampaign(campaign: Campaign) {
        if (!campaign) throw new BadRequestException('Campaign is required');

        if (campaign.status === CampaignStatus.LAUNCHED) {
            throw new BadRequestException('Campaign is already launched');
        }

        campaign.status = CampaignStatus.LAUNCHED;
        await this.campaignRepository.save(campaign);

        await this.scheduleNextStep(campaign);

        return campaign;
    }

    async executeWorkflowStep(id: number) {
        if (!id) throw new BadRequestException('ID is required');
        
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        
        if (!campaign) throw new NotFoundException('Campaign not found');
        
        if (campaign.stepIndex >= campaign.workflow.length) {
            throw new BadRequestException('All workflow steps have been executed');
        }

        if (campaign.status !== CampaignStatus.LAUNCHED) {
            throw new BadRequestException('Campaign is not launched');
        }

        if (['EMAIL', 'SMS'].includes(campaign.workflow[campaign.stepIndex].step)) {
            console.log('Executing step:', campaign.workflow[campaign.stepIndex]);
            console.log('Sending bulk email/SMS');
        } else if (campaign.workflow[campaign.stepIndex].step === 'WAIT') {
            console.log('Executing step:', campaign.workflow[campaign.stepIndex]);
            console.log('Waiting for the next step');
        }

        campaign.stepIndex += 1;
        await this.campaignRepository.save(campaign);

        if (campaign.stepIndex < campaign.workflow.length) {
            await this.scheduleNextStep(campaign);
        } else {
            campaign.status = CampaignStatus.COMPLETED;
            await this.campaignRepository.save(campaign);
            console.log('Campaign completed');
        }
    }


    async scheduleNextStep(campaign: Campaign) {
        if (!campaign) throw new BadRequestException('Campaign is required');

        const nextStep = campaign.workflow[campaign.stepIndex];
        if (!nextStep) throw new BadRequestException('No next step found');

        const jobConfig: { delay?: number, attempts: number, backoff: number } = {
            attempts: 3,
            backoff: 5000
        };

        if (campaign.workflow[campaign.stepIndex].step === 'WAIT' && campaign.workflow[campaign.stepIndex].duration) {
            jobConfig.delay = campaign.workflow[campaign.stepIndex].duration;
        }

        await this.campaignStepExecutionQueue.add(
            CAMPAIGN_STEP_EXECUTION_JOB_NAME,
            { campaignId: campaign.id, stepIndex: campaign.stepIndex },
            jobConfig,
        );
    }
}