import { Event } from './event.entity';

test('Event should be initialized through constructor', () => {
  const objectToSet = {
    name: 'Test Event',
    description: 'This is a test event',
  };

  const event = new Event(objectToSet);

  expect(event).toEqual({
    ...objectToSet,
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  });
});
