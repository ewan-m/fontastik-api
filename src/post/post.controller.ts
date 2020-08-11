import {
	Controller,
	Post,
	UseGuards,
	Body,
	Headers,
	InternalServerErrorException,
	Get,
	Query,
} from "@nestjs/common";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "../auth/token-payload.type";
import { PostRepository } from "./db/post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post as PostEntity } from "./db/post.entity";

@Controller()
export class PostController {
	constructor(private readonly postRepository: PostRepository) {}

	@Post("post")
	@UseGuards(HasValidTokenGuard)
	async createPost(
		@Body() createPostDto: CreatePostDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			try {
				const userId = (decode(token) as TokenPayload).id;

				const post = { userId } as PostEntity;
				post.location = { x: createPostDto.latitude, y: createPostDto.longitude };
				post.content = createPostDto.content;
				await this.postRepository.savePost(post);

				return {};
			} catch (error) {}
		}

		throw new InternalServerErrorException([
			"Something went wrong saving your post",
		]);
	}

	@Get("post")
	async getPosts(@Query("type") type) {
		switch (type) {
			case "new":
			default:
				return await this.postRepository.getNewPosts();
		}
	}
}
