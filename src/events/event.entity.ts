import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { CreateEventDto } from './input/create-event.dto';
import { Attendee } from '../events/attendee.entity';
import { User } from '../auth/user.entity';
import { Paginated } from '../pagination/paginator';

interface EventBase extends Omit<CreateEventDto, 'when'> {
  when: Date;
}

@Entity()
export class Event implements EventBase {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  @Expose()
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  // virtual properties
  @Expose()
  attendeeCount?: number;

  @Expose()
  attendeeAcceptedCount?: number;

  @Expose()
  attendeeMaybeCount?: number;

  @Expose()
  attendeeRejectedCount?: number;

  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }
}

export class PaginatedEvents extends Paginated<Event>(Event) {}
