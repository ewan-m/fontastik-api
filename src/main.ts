import { config } from "dotenv";
config();
import { ValidationPipe, INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from "class-validator";
import { AddRefreshTokenOnExpiryInterceptor } from "./interceptors/add-refresh-token-on-expiry.interceptor";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";

function enableSwagger(app: INestApplication): void {
	if (process.env.ENABLE_SWAGGER === "true") {
		const options = new DocumentBuilder()
			.setTitle("Fontastik API")
			.setDescription("The fontastik API endpoints")
			.setVersion("1.0")
			.addTag("fontastik")
			.build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup("swagger", app, document);
	}
}

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	);
	app.enableCors({ origin: process.env.APPLICATION_URL });

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new AddRefreshTokenOnExpiryInterceptor());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	enableSwagger(app);

	await app.listen(process.env.PORT || 3000, "0.0.0.0");
}
bootstrap();
