import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CreateEventDto } from './create-event.dto';

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
}
