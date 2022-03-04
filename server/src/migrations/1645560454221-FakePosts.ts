import { MigrationInterface, QueryRunner } from 'typeorm';

export class FakePosts1645560454221 implements MigrationInterface {
	name = 'FakePosts1645560454221';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO "post" (title, text, "createdAt") VALUES ('Ernest Rides Again', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:20:57Z');
		INSERT INTO "post" (title, text, "createdAt") VALUES ('Maecenas tincidunt lacus at velit', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:21:57Z');
		INSERT INTO "post" (title, text, "createdAt") VALUES ('Vestibulum ante ipsum primis in faucibus', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:22:57Z');
		INSERT INTO "post" (title, text, "createdAt") VALUES ('Nullam molestie', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:23:57Z');
		INSERT INTO "post" (title, text, "createdAt") VALUES ('Pellentesque viverra pede', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:24:57Z');
		INSERT INTO "post" (title, text, "createdAt") VALUES ('Fusce lacus purus, aliquet at', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.', '2021-07-24T18:25:57Z');`);
	}

	public async down(_: QueryRunner): Promise<void> {}
}
