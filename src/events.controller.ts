import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';

@Controller({
  path: '/events',
})
export class EventsController {
  private events: Event[] = [];

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.find((event) => event.id === +id);
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      id: this.events.length + 1,
      when: new Date(input.when),
    };

    this.events.push(event);

    return event;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const eventIndex = this.events.findIndex((event) => event.id === +id);

    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...input,
      when: input?.when ? new Date(input.when) : this.events[eventIndex].when,
    };

    return this.events[eventIndex];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const eventIndex = this.events.findIndex((event) => event.id === +id);

    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    this.events.splice(eventIndex, 1);
  }
}
