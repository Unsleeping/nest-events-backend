import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing'; // for testing in NestJS context

import { Event } from './event.entity';
import { EventsService } from './events.service';
import * as paginator from '../pagination/paginator';

jest.mock('../pagination/paginator');

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQB;
  let deleteQB;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;

    deleteQB = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQB = {
      delete: jest.fn().mockReturnValue(deleteQB),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQB),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);

      expect(
        service.updateEvent(new Event({ id: 1 }), { name: 'Updated Event' }),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'Updated Event' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        repository,
        'createQueryBuilder',
      );
      const deleteSpy = jest
        .spyOn(selectQB, 'delete')
        .mockReturnValue(deleteQB);
      const whereSpy = jest.spyOn(deleteQB, 'where').mockReturnValue(deleteQB);
      const executeSpy = jest.spyOn(deleteQB, 'execute');

      expect(service.deleteEvent(1)).resolves.toBe(undefined);

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');

      expect(deleteSpy).toHaveBeenCalledTimes(1);

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const orderBySpy = jest
        .spyOn(selectQB, 'orderBy')
        .mockReturnValue(selectQB);
      const leftJoinAndSelectSpy = jest
        .spyOn(selectQB, 'leftJoinAndSelect')
        .mockReturnValue(selectQB);
      const whereSpy = jest.spyOn(selectQB, 'where').mockReturnValue(selectQB);

      const mockedPaginationResult = {
        first: 1,
        last: 1,
        limit: 10,
        total: 10,
        data: [],
      };
      mockedPaginate.mockResolvedValue({
        first: 1,
        last: 1,
        limit: 10,
        total: 10,
        data: [],
      });

      const userId = 5372;

      expect(
        service.getEventsAttendedByUserIdPaginated(userId, {
          limit: 1,
          currentPage: 1,
        }),
      ).resolves.toEqual(mockedPaginationResult);

      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');

      expect(leftJoinAndSelectSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinAndSelectSpy).toHaveBeenCalledWith('e.attendees', 'a');

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId,
      });

      expect(mockedPaginate).toHaveBeenCalledTimes(1);
      expect(mockedPaginate).toHaveBeenCalledWith(selectQB, {
        currentPage: 1,
        limit: 1,
      });
    });
  });
});
