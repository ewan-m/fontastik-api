export type User = {
	user_id?: number;
	name?: string;
	email?: string;
	password_hash?: string;
	password_salt?: string;
	is_blocked?: boolean;
	profile_picture_url?: string;
	has_saved_font?: boolean;
};
