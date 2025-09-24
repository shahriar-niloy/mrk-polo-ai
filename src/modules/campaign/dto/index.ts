import {
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus, Channel } from '../campaign.entity';
import { OmitType, PickType } from '@nestjs/mapped-types';

class WorkflowStepDto {
  @IsString()
  step: string;

  @IsOptional()
  @IsInt()
  duration?: number;
}

export class BaseCampaignDto {
  @IsString()
  @MaxLength(150, { message: 'Name should not exceed 150 characters' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Channel, { each: true, message: 'Each channel must be a valid channel' })
  channels: Channel[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowStepDto)
  workflow: WorkflowStepDto[];

  @IsInt()
  contactListId: number;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}

export class CreateCampaignDto extends OmitType(BaseCampaignDto, ['status'] as const) {}

export class UpdateCampaignDto extends OmitType(BaseCampaignDto, ['status'] as const) {}

export class UpdateCampaignStatusDto extends PickType(BaseCampaignDto, ['status'] as const) {}