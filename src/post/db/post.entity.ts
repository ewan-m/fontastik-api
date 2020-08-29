export interface Post {
	post_id?: number;
	user_id?: number;
	content?: string;
	created?: Date;
	location?: { x: number; y: number };
}
