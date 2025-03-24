import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1742844917644 implements MigrationInterface {
    name = 'Initial1742844917644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "full_name" character varying NOT NULL,
                "password" character varying NOT NULL,
                "gbp_wallet_balance" decimal(10,2) NOT NULL DEFAULT '0',
                "crypto_balance" decimal(10,2) NOT NULL DEFAULT '0',
                "sn_token_balance" decimal(10,2) NOT NULL DEFAULT '0',
                "notification_count" integer NOT NULL DEFAULT '0',
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Notifications table
        await queryRunner.query(`
            CREATE TYPE "public"."notifications_type_enum" AS ENUM('payment_pending', 'payment_completed', 'new_card_added', 'review_reminder')
        `);
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "content" character varying NOT NULL,
                "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'payment_pending',
                "is_read" boolean NOT NULL DEFAULT false,
                "reference_id" character varying,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
            )
        `);

        // Cards table
        await queryRunner.query(`
            CREATE TYPE "public"."cards_card_type_enum" AS ENUM('visa', 'mastercard', 'amex')
        `);
        await queryRunner.query(`
            CREATE TABLE "cards" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "card_holder_name" character varying NOT NULL,
                "last_four_digits" character varying NOT NULL,
                "encrypted_card_number" character varying NOT NULL,
                "card_type" "public"."cards_card_type_enum" NOT NULL,
                "expiry_month" character varying NOT NULL,
                "expiry_year" character varying NOT NULL,
                "is_default" boolean NOT NULL DEFAULT false,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id")
            )
        `);

        // Checkouts table
        await queryRunner.query(`
            CREATE TYPE "public"."checkouts_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."checkouts_selected_payment_method_enum" AS ENUM('credit_card', 'crypto', 'sn_tokens', 'gbp_wallet')
        `);
        await queryRunner.query(`
            CREATE TABLE "checkouts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "amount" decimal(10,2) NOT NULL,
                "merchant_name" character varying NOT NULL,
                "merchant_id" character varying NOT NULL,
                "status" "public"."checkouts_status_enum" NOT NULL DEFAULT 'pending',
                "selected_payment_method" "public"."checkouts_selected_payment_method_enum",
                "qr_code_data" character varying,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_b95a2ad3d9557ef5c2ba0db878a" PRIMARY KEY ("id")
            )
        `);

        // Payments table
        await queryRunner.query(`
            CREATE TYPE "public"."payments_status_enum" AS ENUM('initiated', 'processing', 'completed', 'failed')
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "amount" decimal(10,2) NOT NULL,
                "status" "public"."payments_status_enum" NOT NULL DEFAULT 'initiated',
                "payment_method" "public"."checkouts_selected_payment_method_enum" NOT NULL,
                "transaction_reference" character varying,
                "card_last_four" character varying,
                "checkout_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "REL_d28e0e778ab71f745ed30514ed" UNIQUE ("checkout_id"),
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
            )
        `);

        // Receipts table
        await queryRunner.query(`
            CREATE TABLE "receipts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "receipt_number" character varying NOT NULL,
                "merchant_name" character varying NOT NULL,
                "transaction_date" TIMESTAMP NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "payment_method" character varying NOT NULL,
                "payment_status" character varying NOT NULL,
                "items" jsonb,
                "email_sent" boolean NOT NULL DEFAULT false,
                "payment_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "REL_499e76e48b02116748112decf4" UNIQUE ("payment_id"),
                CONSTRAINT "PK_78e2e3921f735702fa60d6e9961" PRIMARY KEY ("id")
            )
        `);

        // Reviews table
        await queryRunner.query(`
            CREATE TABLE "reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "rating" integer NOT NULL,
                "title" character varying,
                "content" character varying,
                "merchant_name" character varying NOT NULL,
                "email_sent" boolean NOT NULL DEFAULT false,
                "user_id" uuid NOT NULL,
                "payment_id" uuid NOT NULL,
                CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id")
            )
        `);

        // Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "cards" ADD CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "checkouts" ADD CONSTRAINT "FK_ebbedcbf882fda66c39685abeaa" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "payments" ADD CONSTRAINT "FK_d28e0e778ab71f745ed30514ed5" 
            FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3eac2414132a24ebfbe41a" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "receipts" ADD CONSTRAINT "FK_499e76e48b02116748112decf4d" 
            FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "receipts" ADD CONSTRAINT "FK_8886211471df66418a3f3500194" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b577ba7203fb1316b5303c54a" 
            FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create UUID extension if it doesn't exist
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all foreign keys first
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b577ba7203fb1316b5303c54a"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_8886211471df66418a3f3500194"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_499e76e48b02116748112decf4d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3eac2414132a24ebfbe41a"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d28e0e778ab71f745ed30514ed5"`);
        await queryRunner.query(`ALTER TABLE "checkouts" DROP CONSTRAINT "FK_ebbedcbf882fda66c39685abeaa"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "receipts"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "checkouts"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."checkouts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."checkouts_selected_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cards_card_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }
}
