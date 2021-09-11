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
	Param,
} from "@nestjs/common";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { PostRepository } from "./db/post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post as PostEntity } from "./db/post.entity";
import { TokenParserService } from "../services/token-parser.service";
import { PostReactionDto } from "./dto/post-reaction.dto";
import { UserRepository } from "../auth/db/user.repository";
import { PostLikeRepository } from "./db/post-like.repository";

@Controller()
export class PostController {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly userRepository: UserRepository,
		private readonly postLikeRepository: PostLikeRepository,
		private readonly tokenParser: TokenParserService
	) {}

	@Post("react-to-post")
	@UseGuards(HasValidTokenGuard)
	async reactToPost(
		@Body() postReactionDto: PostReactionDto,
		@Headers("authorization") authHeader: string
	) {
		const user_id = this.tokenParser.getUserId(authHeader);
		const { isLike, postId } = postReactionDto;

		await this.postLikeRepository[isLike ? "likePost" : "unlikePost"](
			postId,
			user_id
		);

		return postReactionDto;
	}

	@Get("post-likes")
	@UseGuards(HasValidTokenGuard)
	async getPostLikes(@Headers("authorization") authHeader: string) {
		const userId = this.tokenParser.getUserId(authHeader);

		return await this.postLikeRepository.getPostLikes(userId);
	}

	@Post("post")
	@UseGuards(HasValidTokenGuard)
	async createPost(
		@Body() createPostDto: CreatePostDto,
		@Headers("authorization") authHeader: string
	) {
		const user_id = this.tokenParser.getUserId(authHeader);
		const hasFont = await this.userRepository.hasUserSavedFont(user_id);

		if (hasFont) {
			try {
				const { x, y, content } = createPostDto;
				const post = { user_id, location: { x, y }, content } as PostEntity;
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
		@Query("y") longitude,
		@Query("offset") offset
	) {
		switch (type) {
			case "popular":
				return await this.postRepository.getPopularPosts(offset);
			case "local":
				return await this.postRepository.getLocalPosts(latitude, longitude, offset);
			case "new":
			default:
				return await this.postRepository.getNewPosts(offset);
		}
	}

	@Get("user/:userId/posts")
	async getPostsForUser(
		@Param("userId") userId: string,
		@Query("offset") offset
	) {
		if (/^\d+$/.test(userId)) {
			return await this.postRepository.getPostsForUser(parseInt(userId), offset);
		} else {
			throw new BadRequestException([
				"The userId route parameter should be an integer.",
			]);
		}
	}
}
