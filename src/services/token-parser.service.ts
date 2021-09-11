import { Injectable, BadRequestException } from "@nestjs/common";
import type { TokenPayload } from "../auth/token-payload.type";
import { decode } from "jsonwebtoken";

@Injectable()
export class TokenParserService {
	public getUserId(authHeader: string) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			const userId = (decode(token) as TokenPayload).id;

			if (userId) {
				return userId;
			}
		}

		throw new BadRequestException([
			"There is something wrong with your session. Please try logging out and in again.",
		]);
	}
}
