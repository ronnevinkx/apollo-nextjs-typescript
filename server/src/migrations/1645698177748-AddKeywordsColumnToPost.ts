import {MigrationInterface, QueryRunner} from "typeorm";

export class AddKeywordsColumnToPost1645698177748 implements MigrationInterface {
    name = 'AddKeywordsColumnToPost1645698177748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "keywords" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "keywords"`);
    }

}
