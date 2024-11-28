import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development.local'
          : '.env.test.local',
      load: [ormConfig], // TODO: change to prod config for production
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      // register async to use runtime env variables, not the static object evaluated at the moment it's defined
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }),
    AuthModule,
    EventsModule,
  ],
  providers: [AppService], // any class with @Injectable() should be registered in providers
  controllers: [AppController],
})
export class AppModule {}
