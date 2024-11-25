import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Event, PaginatedEvents } from './event.entity';
import { AttendeeAnswerEnum } from 'src/events/attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { User } from 'src/auth/user.entity';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    const event = {
      ...input,
      organizer: user,
      when: new Date(input.when),
    };

    return await this.eventsRepository.save(event);
  }

  public async updateEvent(
    event: Event,
    input: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsRepository.save({
      ...event,
      ...input,
      when: input?.when ? new Date(input.when) : event.when,
    });
  }
  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAcceptedCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :accepted', {
            accepted: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybeCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :maybe', {
            maybe: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejectedCount',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :rejected', {
            rejected: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    const query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    const when = Number(filter.when);

    if (when) {
      if (when === WhenEventFilter.Today) {
        return query.andWhere(
          'e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY',
        );
      }

      if (when === WhenEventFilter.Tomorrow) {
        return query.andWhere(
          'e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY',
        );
      }

      if (when === WhenEventFilter.ThisWeek) {
        return query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (when === WhenEventFilter.NextWeek) {
        return query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    const qbResult = await this.getEventsWithAttendeeCountFiltered(filter);
    this.logger.debug(qbResult.getSql());
    return await paginate(qbResult, paginateOptions);
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions,
    );
  }

  private getEventsOrganizedByUserIdQuery(userId: number) {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  public async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions,
    );
  }

  private getEventsAttendedByUserIdQuery(userId: number) {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
  }
}
