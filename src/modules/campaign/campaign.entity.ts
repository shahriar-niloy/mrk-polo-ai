import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { ContactList } from '../contact/entity/contact-list.entity';

export enum CampaignStatus {
    DRAFT = 'draft',
    LAUNCHED = 'launched',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}

export enum Channel {
    EMAIL = 'email',
    SMS = 'sms',
}

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: Channel,
        array: true,
    })
    channels: Channel[];

    @Column({ type: 'jsonb', nullable: false })
    workflow: Array<{ step: string; duration?: number }>;

    @ManyToOne(() => ContactList, (contactList) => contactList.campaigns, {
        eager: true,
    })
    userList: ContactList;

    @Column({ type: 'timestamptz', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamptz', nullable: true })
    endDate: Date;

    @Column({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.DRAFT,
    })
    status: CampaignStatus;

    @Column({ name: 'step_index', default: 0 })
    stepIndex: number;
}
