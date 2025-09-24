import { Controller, Body, Param, Patch, Get, Post, Delete } from '@nestjs/common';
import { ContactService } from '../contact.service';
import { BaseContactListDto, CreateContactDto, CreateContactListDto, UpdateContactDto, UpdateContactListDto } from '../dto';

@Controller('contact-list')
export class ContactListController {
    constructor(private readonly contactService: ContactService) { }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.contactService.getContactList(id);
    }

    @Get('')
    async getList(@Param('id') id: number) {
        return this.contactService.getAllContactList();
    }

    @Post("")
    async create(@Body() createContactListDto: CreateContactListDto) {
        return this.contactService.createContactList(createContactListDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateContactListDto: UpdateContactListDto) {
        return this.contactService.updateContactList(id, updateContactListDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.contactService.deleteContactList(id);
    }

    @Post(':id/contacts')
    async addContacts(@Param('id') id: number, @Body() contactsDto: CreateContactDto[]) {
        return this.contactService.addContactsToList(id, contactsDto);
    }
}
