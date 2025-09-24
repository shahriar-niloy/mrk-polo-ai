import { Controller, Body, Param, Patch, Get, Post, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignStatusDto } from './dto';

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Get('')
    async get() {
        return this.campaignService.getCampaignList();
    }

    @Post("")
    async create(@Body() createCampaignDto: CreateCampaignDto) {
        return this.campaignService.createCampaign(createCampaignDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() statusDto: UpdateCampaignStatusDto) {
        return this.campaignService.updateCampaign(id, statusDto);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: number, @Body() statusDto: UpdateCampaignStatusDto) {
        if (!statusDto.status) throw new Error('Status is required');
        return this.campaignService.updateCampaignStatus(id, statusDto.status);
    }
}
