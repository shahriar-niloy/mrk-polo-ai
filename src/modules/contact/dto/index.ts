import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BaseContactListDto {
    @IsString()
    @MaxLength(100, { message: 'Name should not exceed 100 characters' })
    @IsNotEmpty()
    name: string;
}

export class CreateContactListDto extends OmitType(BaseContactListDto, [] as const) {}

export class UpdateContactListDto extends OmitType(BaseContactListDto, [] as const) {}

export class BaseContactDto {
    @IsString()
    @MaxLength(100, { message: 'Name should not exceed 100 characters' })
    name: string;

    @IsString()
    @MaxLength(100, { message: 'Email should not exceed 100 characters' })
    email: string;

    @IsString()
    @MaxLength(20, { message: 'SMS should not exceed 20 characters' })
    sms: string;
}

export class CreateContactDto extends OmitType(BaseContactDto, [] as const) {}

export class UpdateContactDto extends PartialType(BaseContactDto) {}