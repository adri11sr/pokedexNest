import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ! Prefijo para acceder al API
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(  
    new ValidationPipe({
      // ! Remueve los datos que van de más en el body de la request
      // ! Y unicamente envía lo que se ha especificado en el DTO
      whitelist: true, 
 
      // ! Si hay datos de más en el body de la request tira un error
      // ! Indicando que la propiedad no debería de existir
      forbidNonWhitelisted: true,
 
      // ! Excluye los campos undefined
      transformOptions: {
        exposeUnsetFields: false
      }
      
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
