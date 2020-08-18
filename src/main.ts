import { config } from "dotenv";
config();
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from 'body-parser';
import { AppModule } from "./app.module";
import { useContainer } from "class-validator";
import { AddRefreshTokenOnExpiryInterceptor } from "./interceptors/add-refresh-token-on-expiry.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: { origin: process.env.APPLICATION_URL },
	});
	app.useGlobalPipes(new ValidationPipe());
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	app.useGlobalInterceptors(new AddRefreshTokenOnExpiryInterceptor());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	await app.listen(3000);
}
bootstrap();
