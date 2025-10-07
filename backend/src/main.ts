import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, //transform query params automatically
            whitelist: true, //remove unknown fields
        })
    );

    //swagger
    const config = new DocumentBuilder()
        .setTitle('Legothec')
        .setDescription('Bibliothèque Lego')
        .setVersion('1.0')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
