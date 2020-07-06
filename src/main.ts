import { config } from "dotenv";
config();
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from "class-validator";
import { AddRefreshTokenOnExpiryInterceptor } from "./interceptors/add-refresh-token-on-expiry.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: { origin: process.env.APPLICATION_URL },
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new AddRefreshTokenOnExpiryInterceptor());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	await app.listen(3000);
}
bootstrap();
