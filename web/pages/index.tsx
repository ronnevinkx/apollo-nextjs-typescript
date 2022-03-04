import type { NextPage } from 'next';
import { CreatePost } from '../components/CreatePost';
import { Layout } from '../components/Layout';
import { PostList } from '../components/PostList';
import { addApolloState, initializeApollo } from '../utils/apolloClient';
import { PostsDocument } from '../__generated__/graphql';

const Home: NextPage = () => {
	return (
		<Layout>
			<div>Some SSG page with posts, links and fetch more</div>
			<CreatePost />
			<PostList />
		</Layout>
	);
};

export async function getStaticProps() {
	const apolloClient = initializeApollo();

	await apolloClient.query({
		query: PostsDocument,
		variables: {
			limit: 3,
			cursor: null
		}
	});

	return addApolloState(apolloClient, {
		props: {},
		revalidate: 1
	});
}

export default Home;
