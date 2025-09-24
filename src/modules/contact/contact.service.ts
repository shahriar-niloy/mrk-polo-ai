import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entity/contact.entity';
import { ContactList } from './entity/contact-list.entity';
import { BaseContactListDto, CreateContactDto, CreateContactListDto, UpdateContactListDto } from './dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
        @InjectRepository(ContactList)
        private contactListRepository: Repository<ContactList>,
    ) {}

    async getContactList(id: number): Promise<ContactList | null> {
        if (!id) throw new BadRequestException('ID is required');

        const contactList = await this.contactListRepository.findOne({
            where: { id },
            relations: ['contacts'],
        });

        if (!contactList) throw new NotFoundException('Contact List not found');

        return contactList;
    }

    async getAllContactList(): Promise<ContactList[]> {
        return this.contactListRepository.find({ relations: ['contacts'] });
    }

    async createContactList(createContactListDto: CreateContactListDto): Promise<ContactList> {
        const contactList = this.contactListRepository.create(createContactListDto);
        return await this.contactListRepository.save(contactList);
    }

    async updateContactList(id: number, updateContactListDto: UpdateContactListDto): Promise<ContactList | null> {
        if (!id) throw new BadRequestException('ID is required');

        const existingContactList = await this.contactListRepository.findOne({ where: { id } });

        if (!existingContactList) throw new NotFoundException('Contact List not found');

        this.contactListRepository.merge(existingContactList, updateContactListDto);

        await this.contactListRepository.save(existingContactList);

        return existingContactList;
    }

    async deleteContactList(id: number): Promise<void> {
        if (!id) throw new BadRequestException('ID is required');

        const contactList = await this.contactListRepository.findOne({ where: { id } });
        if (!contactList) throw new NotFoundException('Contact List not found');

        await this.contactListRepository.remove(contactList);
    }

    async addContactsToList(
        listId: number,
        contactsDto: CreateContactDto[],
    ): Promise<Contact[]> {
        if (!listId) throw new BadRequestException('List ID is required');

        const contactList = await this.contactListRepository.findOne({
            where: { id: listId },
            relations: ['contacts'],
        });

        if (!contactList) throw new NotFoundException('Contact List not found');

        contactList.contacts = contactList.contacts || [];

        if (!contactsDto.length) return [];

        const newContacts = contactsDto.map((dto) =>
            this.contactRepository.create(dto),
        );

        contactList.contacts.push(...newContacts);

        await this.contactListRepository.save(contactList);

        return newContacts;
    }

    async removeContactsFromList(
        listId: number,
        contactIds: number[],
    ): Promise<void> {
        if (!listId) throw new BadRequestException('List ID is required');
        if (!contactIds?.length) return;

        const contactList = await this.contactListRepository.findOne({
            where: { id: listId },
            relations: ['contacts'],
        });

        if (!contactList) throw new NotFoundException('Contact List not found');

        contactList.contacts = contactList.contacts.filter(
            (c) => !contactIds.includes(c.id),
        );

        await this.contactListRepository.save(contactList);
    }

    async updateContact(
        contactId: number,
        updateDto: Partial<CreateContactDto>,
    ): Promise<Contact> {
        if (!contactId) throw new BadRequestException('Contact ID is required');

        const contact = await this.contactRepository.findOne({ where: { id: contactId } });
        if (!contact) throw new NotFoundException('Contact not found');

        this.contactRepository.merge(contact, updateDto);

        return await this.contactRepository.save(contact);
    }

}
