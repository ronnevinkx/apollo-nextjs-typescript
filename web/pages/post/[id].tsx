import { Layout } from '../../components/Layout';
import { initializeApollo } from '../../utils/apolloClient';
import { Post, PostDocument, PostsDocument } from '../../__generated__/graphql';

const Post: React.FC<{ post: Post }> = ({ post }) => {
	return (
		<Layout>
			<h1>{post.title}</h1>
			<p>{post.text}</p>
		</Layout>
	);
};

export default Post;

// destructure id from context.params.id
interface ParamProps {
	params: {
		id: string;
	};
}
export async function getStaticProps({ params: { id } }: ParamProps) {
	const apolloClient = initializeApollo();

	const result = await apolloClient.query({
		query: PostDocument,
		variables: {
			id: parseInt(id)
		}
	});

	return {
		props: {
			post: result.data.post
		}
	};
}

// getStaticPaths tells Next which pages should be statically generated at build time
// this is a Node.js context, so we can't use the generated hooks
export const getStaticPaths = async () => {
	const apolloClient = initializeApollo();

	const result = await apolloClient.query({
		query: PostsDocument,
		variables: {
			limit: 50, // these should be unlimited
			cursor: null
		}
	});

	const paths = result.data.posts.posts.map((post: Post) => {
		return { params: { id: post.id.toString() } };
	});

	// if we set fallback to 'blocking', Next will wait for the page to be generated
	// via SSR, then cache it for future requests
	return {
		paths,
		fallback: 'blocking'
	};
};
