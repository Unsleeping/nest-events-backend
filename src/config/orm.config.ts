import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Profile } from 'src/auth/profile.entity';
import { User } from 'src/auth/user.entity';
import { Attendee } from 'src/events/attendee.entity';
import { Event } from 'src/events/event.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, User, Profile],
    synchronize: true,
  }),
);
