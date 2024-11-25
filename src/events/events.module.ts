import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from 'src/events/attendee.entity';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])], // to inject the event and attendee repositories
  providers: [EventsService], // any class with @Injectable() should be registered in providers
  controllers: [EventsController],
})
export class EventsModule {}
