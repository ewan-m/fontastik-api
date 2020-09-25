import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { decode, sign } from "jsonwebtoken";
import { map } from "rxjs/operators";
import { TokenPayload } from "../auth/token-payload.type";
import { parseISO, differenceInMinutes } from "date-fns";

@Injectable()
export class AddRefreshTokenOnExpiryInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			map((data) => {
				const request = context.switchToHttp().getRequest();
				const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

				if (authToken) {
					const decodedToken = decode(authToken);
					const date = parseISO(decodedToken?.["exp"]);
					if (date && differenceInMinutes(date, new Date()) < 60) {
						context
							.switchToHttp()
							.getResponse()
							.header(
								"authorization",
								sign(
									{
										email: decodedToken["email"],
										name: decodedToken["name"],
										id: decodedToken["id"],
									} as TokenPayload,
									process.env.JWT_SECRET,
									{ expiresIn: "1d" }
								)
							);
					}
				}
				return data;
			})
		);
	}
}
