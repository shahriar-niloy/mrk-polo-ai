import { Controller, Body, Param, Patch } from '@nestjs/common';
import { ContactService } from '../contact.service';
import { UpdateContactDto } from '../dto';

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.updateContact(id, updateContactDto);
  }
}
