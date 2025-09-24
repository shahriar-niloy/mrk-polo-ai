import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactList } from './entity/contact-list.entity';
import { Contact } from './entity/contact.entity';
import { ContactService } from './contact.service';
import { ContactController } from './controllers/contact.controller';
import { ContactListController } from './controllers/contact-list.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ContactList, Contact])],
    providers: [ContactService],
    controllers: [ContactController, ContactListController],
    exports: [ContactService],
})
export class ContactModule {}
