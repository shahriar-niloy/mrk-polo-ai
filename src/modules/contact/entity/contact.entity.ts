import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { ContactList } from './contact-list.entity';

@Entity({ name: 'contact' })
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column()
  email: string;

  @Column()
  sms: string;

  @ManyToMany(() => ContactList, (contactList) => contactList.contacts)
  contactLists: ContactList[];
}
