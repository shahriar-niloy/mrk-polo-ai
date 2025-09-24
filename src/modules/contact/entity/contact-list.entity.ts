import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Contact } from './contact.entity';
import { Campaign } from 'src/modules/campaign/campaign.entity';


@Entity({ name: 'contact_list' })
export class ContactList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Contact, (contact) => contact.contactLists, { cascade: true })
  @JoinTable({ name: 'contact_list_contacts' })
  contacts: Contact[];

  @ManyToOne(() => Campaign, (campaign) => campaign.userList)
  campaigns: Campaign[];
}
