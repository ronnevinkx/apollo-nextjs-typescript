import { NetworkStatus } from '@apollo/client';
import Link from 'next/link';
import { usePostsQuery } from '../__generated__/graphql';

interface PostListProps {}

export const PostList: React.FC<PostListProps> = () => {
	const { data, loading, fetchMore, variables, error, networkStatus } =
		usePostsQuery({
			variables: { limit: 3, cursor: null },
			notifyOnNetworkStatusChange: true
		});

	const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

	if (error) return <div>Error loading posts...</div>;
	if (loading && !loadingMorePosts) return <div>Loading...</div>;

	const { posts } = data!;
	const { hasMore } = posts;

	const loadMorePosts = () => {
		fetchMore({
			variables: {
				limit: variables?.limit,
				cursor: posts.posts[posts.posts.length - 1].createdAt
			}
		});
	};

	return (
		<section>
			<ul>
				{posts.posts.map((post, index) => (
					<li key={post.id}>
						<div>
							<span>{index + 1}. </span>
							<Link href="/post/[id]" as={`/post/${post.id}`}>
								<a>{post.title}</a>
							</Link>
						</div>
					</li>
				))}
			</ul>
			{hasMore && (
				<button
					onClick={() => loadMorePosts()}
					disabled={loadingMorePosts}
				>
					{loadingMorePosts ? 'Loading...' : 'Show More'}
				</button>
			)}
		</section>
	);
};
