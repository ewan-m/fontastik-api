export class User {
	userId?: number;
	name?: string;
	email?: string;
	passwordHash?: string;
	passwordSalt?: string;
	isBlocked?: boolean;
	profilePictureUrl?: string;
}
