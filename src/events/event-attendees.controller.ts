import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { AttendeesService } from './attendees.service';

@Controller('/events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  // @Param decorator get value of :eventId from the URL
  async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return await this.attendeesService.findByEventId(eventId);
  }
}
