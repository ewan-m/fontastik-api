import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { verify } from "jsonwebtoken";

@Injectable()
export class HasValidTokenGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

		if (authToken) {
			try {
				verify(authToken, process.env.JWT_SECRET);
				return true;
			} catch (error) {
				throw new UnauthorizedException(["Invalid token"]);
			}
		} else {
			throw new UnauthorizedException(["No token"]);
		}
	}
}
