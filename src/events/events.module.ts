import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from '../events/attendee.entity';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './currrent-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])], // to inject the event and attendee repositories
  providers: [EventsService, AttendeesService], // any class with @Injectable() should be registered in providers
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsOrganizedByUserController,
  ],
})
export class EventsModule {}
