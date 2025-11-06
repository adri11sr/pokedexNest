import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {MongooseModule} from '@nestjs/mongoose'

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfigurration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfigurration],
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
      serveRoot: '/',
    }),

    MongooseModule.forRoot(process.env.MONGODB ?? 'mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {}
