import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CreateEventDto } from './input/create-event.dto';
import { Attendee } from 'src/events/attendee.entity';

interface EventBase extends Omit<CreateEventDto, 'when'> {
  when: Date;
}

@Entity()
export class Event implements EventBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  when: Date;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: Attendee[];

  // virtual properties
  attendeeCount?: number;
  attendeeAcceptedCount?: number;
  attendeeMaybeCount?: number;
  attendeeRejectedCount?: number;
}
