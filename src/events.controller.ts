import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';

@Controller({
  path: '/events',
})
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.repository.findOneBy({ id });
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
    };

    return await this.repository.save(event);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.repository.findOneBy({ id });

    return await this.repository.save({
      ...event,
      ...input,
      when: input?.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const event = await this.repository.findOneBy({ id: +id });

    await this.repository.remove(event);
  }
}
