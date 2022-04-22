import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	NormalizedCacheObject
} from '@apollo/client';
import merge from 'deepmerge';
import fetch from 'isomorphic-unfetch';
import isEqual from 'lodash/isEqual';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { useMemo } from 'react';

import { PaginatedPosts } from '../__generated__/graphql';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient(ctx: NextPageContext | null) {
	// The `ctx` (NextPageContext) will only be present on the server.
	// use it to extract auth headers (ctx.req) or similar.
	const enhancedFetch = (url: string, init: any) =>
		fetch(url, {
			...init,
			headers: {
				...init.headers,
				Cookie: ctx?.req?.headers.cookie
			}
		}).then(res => res);

	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_API_URL as string, // Server URL (must be absolute)
			credentials: 'include', // 'include' / 'same-origin'. this includes the cookie. // Additional fetch() options like `credentials` or `headers`
			fetch: ctx ? enhancedFetch : fetch
		}),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						posts: {
							keyArgs: [],
							merge(
								existing: PaginatedPosts | undefined,
								incoming: PaginatedPosts
							): PaginatedPosts {
								return {
									...incoming,
									posts: [
										...(existing?.posts || []),
										...incoming.posts
									]
								};
							}
						}
					}
				}
			}
		})
	});
}

export function initializeApollo(
	initialState = null,
	ctx: NextPageContext | null = null
) {
	const _apolloClient = apolloClient ?? createApolloClient(ctx);

	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if (initialState) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = _apolloClient.extract();

		// Merge the initialState from getStaticProps/getServerSideProps in the existing cache
		const data = merge(existingCache, initialState, {
			// combine arrays using object equality (like in sets)
			arrayMerge: (destinationArray, sourceArray) => [
				...sourceArray,
				...destinationArray.filter(d =>
					sourceArray.every(s => !isEqual(d, s))
				)
			]
		});

		// Restore the cache with the merged data
		_apolloClient.cache.restore(data);
	}
	// For SSG and SSR always create a new Apollo Client
	if (typeof window === 'undefined') return _apolloClient;
	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function addApolloState(
	client: ApolloClient<NormalizedCacheObject>,
	pageProps: AppProps['pageProps']
) {
	if (pageProps?.props) {
		pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
	}

	return pageProps;
}

export function useApollo(pageProps: AppProps['pageProps']) {
	const state = pageProps[APOLLO_STATE_PROP_NAME];
	const store = useMemo(() => initializeApollo(state), [state]);
	return store;
}
