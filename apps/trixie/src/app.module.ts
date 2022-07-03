import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PetsModule } from './pets/pets.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FireBaseModule } from './firebase.module';
import { StaticModule } from './static/static.module';
import { EventsModule } from './events/events.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    FireBaseModule.forRoot(),
    AuthModule,
    StaticModule,
    PetsModule,
    EventsModule,
  ],
})
export class AppModule {}
