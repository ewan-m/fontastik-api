import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import type { TokenPayload } from "../auth/token-payload.type";

@Injectable()
export class TokenIdMatchesRequestedIdGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const requestingId = request?.params?.userId;
		const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

		if (authToken && requestingId !== null && requestingId !== undefined) {
			const tokenId = (decode(authToken) as TokenPayload)?.id;

			if (requestingId.toString() === tokenId.toString()) {
				return true;
			}
		}

		throw new ForbiddenException([
			"Requested user id does not match token's user id.",
		]);
	}
}
