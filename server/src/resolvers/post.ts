import {
	Arg,
	Field,
	InputType,
	Int,
	Mutation,
	ObjectType,
	Query
} from 'type-graphql';
import { getConnection } from 'typeorm';

import { Post } from '../entities/Post';

@InputType()
export class PostInput {
	@Field()
	title: string;

	@Field()
	text: string;

	@Field({ nullable: true })
	keywords?: string;
}

@ObjectType()
class PaginatedPosts {
	@Field(() => [Post])
	posts: Post[];

	@Field()
	hasMore: boolean;
}

export class PostResolver {
	// read all
	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null
	): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit);
		const realLimitPlusOne = realLimit + 1;
		const replacements: any[] = [realLimitPlusOne];

		if (cursor) {
			replacements.push(new Date(parseInt(cursor)));
		}

		const posts = await getConnection().query(
			`
			SELECT p.*
			FROM post p
			${cursor ? `WHERE p."createdAt" < $2` : ''}
			ORDER BY p."createdAt" DESC
			LIMIT $1
		`,
			replacements
		);

		return {
			posts: posts.slice(0, realLimit),
			hasMore: posts.length === realLimitPlusOne
		};
	}

	// read single
	@Query(() => Post, { nullable: true })
	async post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	// create
	@Mutation(() => Post)
	async createPost(@Arg('input') input: PostInput): Promise<Post> {
		// 2 sql queries, 1 to save, 1 to select
		return Post.create({ ...input }).save();
	}
}
