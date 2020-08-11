export interface Post {
	postId?: number;
	userId?: number;
	fontId?: number;
	content?: string;
	created?: Date;
	location?: { x: number; y: number };
}
