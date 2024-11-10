import { CreateEventDto } from './create-event.dto';

interface EventBase extends Omit<CreateEventDto, 'when'> {
  when: Date;
}

export class Event implements EventBase {
  id: number;
  when: Date;
  name: string;
  description: string;
  address: string;
}
