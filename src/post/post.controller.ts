import {
	Controller,
	Post,
	UseGuards,
	Body,
	Headers,
	InternalServerErrorException,
	Get,
	Query,
	BadRequestException,
} from "@nestjs/common";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { PostRepository } from "./db/post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post as PostEntity } from "./db/post.entity";
import { FontRepository } from "../font/db/font.repository";
import { TokenParserService } from "../services/token-parser.service";

@Controller()
export class PostController {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly fontRepository: FontRepository,
		private readonly tokenParser: TokenParserService
	) {}

	@Get("posts-for-user")
	@UseGuards(HasValidTokenGuard)
	async getPostsForUser(@Headers("authorization") authHeader: string) {
		const userId = this.tokenParser.getUserId(authHeader);
		return await this.postRepository.getPostsForUser(userId);
	}

	@Post("post")
	@UseGuards(HasValidTokenGuard)
	async createPost(
		@Body() createPostDto: CreatePostDto,
		@Headers("authorization") authHeader: string
	) {
		const user_id = this.tokenParser.getUserId(authHeader);
		const hasFont = await this.fontRepository.hasUserSavedFont(user_id);

		if (hasFont) {
			try {
				const post = { user_id } as PostEntity;
				post.location = { x: createPostDto.latitude, y: createPostDto.longitude };
				post.content = createPostDto.content;
				return this.postRepository.savePost(post);
			} catch (error) {
				throw new InternalServerErrorException([
					"Something went wrong saving your post",
				]);
			}
		} else {
			throw new BadRequestException([
				"Please create and save your font before you post.",
			]);
		}
	}

	@Get("posts")
	async getPosts(@Query("type") type) {
		switch (type) {
			case "new":
			default:
				return await this.postRepository.getNewPosts();
		}
	}
}
