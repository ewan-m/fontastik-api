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
import { PostReactionDto } from "./dto/post-reaction.dto";

@Controller()
export class PostController {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly fontRepository: FontRepository,
		private readonly tokenParser: TokenParserService
	) {}

	@Post("react-to-post")
	@UseGuards(HasValidTokenGuard)
	async reactToPost(
		@Body() postReactionDto: PostReactionDto,
		@Headers("authorization") authHeader: string
	) {
		const user_id = this.tokenParser.getUserId(authHeader);

		postReactionDto.isLike
			? await this.postRepository.likePost(postReactionDto.postId, user_id)
			: await this.postRepository.unlikePost(postReactionDto.postId, user_id);

		return postReactionDto;
	}

	@Get("post-likes")
	@UseGuards(HasValidTokenGuard)
	async getPostLikes(@Headers("authorization") authHeader: string) {
		const userId = this.tokenParser.getUserId(authHeader);

		return await this.postRepository.getPostLikes(userId);
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
				post.location = { x: createPostDto.x, y: createPostDto.y };
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
	async getPosts(
		@Query("type") type,
		@Query("x") latitude,
		@Query("y") longitude
	) {
		switch (type) {
			case "popular":
				return await this.postRepository.getPopularPosts();
			case "local":
				return await this.postRepository.getLocalPosts(latitude, longitude);
			case "new":
			default:
				return await this.postRepository.getNewPosts();
		}
	}

	@Get("posts-for-user")
	@UseGuards(HasValidTokenGuard)
	async getPostsForUser(@Headers("authorization") authHeader: string) {
		const userId = this.tokenParser.getUserId(authHeader);
		return await this.postRepository.getPostsForUser(userId);
	}
}
