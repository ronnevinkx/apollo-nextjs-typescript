import type { NextPage, NextPageContext } from 'next';
import { Layout } from '../components/Layout';
import { PostList } from '../components/PostList';
import { addApolloState, initializeApollo } from '../utils/apolloClient';
import { PostsDocument } from '../__generated__/graphql';

const Home: NextPage = () => {
	return (
		<Layout>
			<div>Some SSR page with posts, links and fetch more</div>
			<PostList />
		</Layout>
	);
};

// important with getServerSideProps to pass context if it contains an auth cookie.
// on the client this works eitherway, but to get it working on the server, make sure
// to pass the context.
export async function getServerSideProps(context: NextPageContext) {
	const apolloClient = initializeApollo(null, context);

	await apolloClient.query({
		query: PostsDocument,
		variables: {
			limit: 3,
			cursor: null
		}
	});

	// return {
	// 	props: {}
	// };

	// adds "pageProps":{"__APOLLO_STATE__" ... with posts to props,
	// same way as with getStaticProps, so server already has data
	// at build time (ssg) / during rendering (ssr)
	return addApolloState(apolloClient, {
		props: {}
	});
}

export default Home;
