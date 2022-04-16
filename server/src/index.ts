import 'dotenv-safe/config';

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { Post } from './entities/Post';
import { PostResolver } from './resolvers/post';
import { timestamp } from './utils/timestamp';

const main = async () => {
	// main variables
	const PORT = parseInt(process.env.PORT) || 4000;
	const NODE_ENV = process.env.NODE_ENV || 'development';
	const WEB_CLIENT = process.env.WEB_CLIENT || 'http://localhost:3000';

	// database setup
	const conn = await createConnection({
		type: 'postgres',
		url: process.env.DATABASE_URL,
		logging: true,
		migrations: [path.join(__dirname, './migrations/*')],
		entities: [Post]
	});

	// when migration file is added, server auto-restarts and
	// then this will keep the database up to date
	await conn.runMigrations();

	// express setup
	const app = express();
	const httpServer = http.createServer(app);

	if (NODE_ENV === 'production') {
		app.use(cors({ origin: WEB_CLIENT }));
	}

	// apollo setup
	const server = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver],
			validate: false
		}),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
	});

	await server.start();
	server.applyMiddleware({ app });
	await new Promise<void>(resolve =>
		httpServer.listen({ port: PORT }, resolve)
	);

	console.log(
		`${timestamp()}: 🚀 Server is running in ${NODE_ENV} mode on http://localhost:${PORT}${
			server.graphqlPath
		}`
	);
};

main().catch(error => console.error(error));
