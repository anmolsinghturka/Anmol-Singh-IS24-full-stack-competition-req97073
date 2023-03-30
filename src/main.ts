/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import {
    ValidationException,
    ValidationFilter,
} from './util/filter.validation';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('/api');

    const config = new DocumentBuilder()
        .setTitle('Project Management API By Anmol Singh')
        .setDescription('Province of British Columbia')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/api-docs', app, document);

    app.useGlobalFilters(new ValidationFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            skipMissingProperties: false,
            exceptionFactory: (errors: ValidationError[]) => {
                const errMsg = {};
                errors.forEach((err) => {
                    errMsg[err.property] = [...Object.values(err.constraints)];
                });
                return new ValidationException(errMsg);
            },
        }),
    );

    const port = process.env.PORT;
    await app.listen(port);
}
bootstrap();
