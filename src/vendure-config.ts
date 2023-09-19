import {
	dummyPaymentHandler,
	DefaultJobQueuePlugin,
	DefaultSearchPlugin,
	VendureConfig,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import {
	AssetServerPlugin,
	configureS3AssetStorage,
} from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { MultivendorPlugin } from "./plugins/multivendor-plugin/multivendor.plugin";

const IS_DEV = process.env.APP_ENV === "dev";
const LOCAL_CERT_PATH = "ca-certificate.crt";

export const config: VendureConfig = {
	apiOptions: {
		port: 3001,
		adminApiPath: "admin-api",
		shopApiPath: "shop-api",
		// The following options are useful in development mode,
		// but are best turned off for production for security
		// reasons.
		...(IS_DEV
			? {
					adminApiPlayground: {
						settings: { "request.credentials": "include" } as any,
					},
					adminApiDebug: true,
					shopApiPlayground: {
						settings: { "request.credentials": "include" } as any,
					},
					shopApiDebug: true,
			  }
			: {}),
	},
	authOptions: {
		requireVerification: false,
		tokenMethod: ["bearer", "cookie"],
		superadminCredentials: {
			identifier: process.env.SUPERADMIN_USERNAME,
			password: process.env.SUPERADMIN_PASSWORD,
		},
		cookieOptions: {
			secret: process.env.COOKIE_SECRET,
		},
	},
	dbConnectionOptions: {
		type: "postgres",
		// See the README.md "Migrations" section for an explanation of
		// the `synchronize` and `migrations` options.
		synchronize: true,
		migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
		logging: false,
		database: IS_DEV ? "marketplace" : process.env.DB_NAME,
		schema: process.env.DB_SCHEMA,
		host: IS_DEV ? "localhost" : process.env.DB_HOST,
		port: IS_DEV ? 5432 : +process.env.DB_PORT,
		username: IS_DEV ? "postgres" : process.env.DB_USERNAME,
		password: IS_DEV ? "postgres" : process.env.DB_PASSWORD,
		// ssl: {
		// 	rejectUnauthorized: false,
		// 	ca: IS_DEV
		// 		? fs.readFileSync(LOCAL_CERT_PATH).toString()
		// 		: process.env.CERT_PATH,
		// },
	},
	paymentOptions: {
		paymentMethodHandlers: [dummyPaymentHandler],
	},
	// When adding or altering custom field definitions, the database will
	// need to be updated. See the "Migrations" section in README.md.
	customFields: {},
	plugins: [
		MultivendorPlugin.init({
			platformFeePercent: 10,
			platformFeeSKU: "FEE",
		}),
		AssetServerPlugin.init({
			route: "assets",
			assetUploadDir: path.join(__dirname, "../static/assets"),
			// For local dev, the correct value for assetUrlPrefix should
			// be guessed correctly, but for production it will usually need
			// to be set manually to match your production url.
			assetUrlPrefix: "https://localhost/assets/",
			// storageStrategyFactory: configureS3AssetStorage({
			// 	bucket: "avendure-space",
			// 	credentials: {
			// 		accessKeyId: process.env.DO_SPACE_ID,
			// 		secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
			// 	},
			// 	nativeS3Configuration: {
			// 		endpoint: process.env.DO_SPACE_ENDPOINT,
			// 		signatureVersion: "v4",
			// 		forcePathStyle: false,
			// 		region: "us-west-1",
			// 	},
			// 	nativeS3UploadConfiguration: {
			// 		ACL: "public-read",
			// 	},
			// }),
		}),
		DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
		DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
		EmailPlugin.init({
			devMode: true,
			outputPath: path.join(__dirname, "../static/email/test-emails"),
			route: "mailbox",
			handlers: defaultEmailHandlers,
			templatePath: path.join(__dirname, "../static/email/templates"),
			globalTemplateVars: {
				// The following variables will change depending on your storefront implementation.
				// Here we are assuming a storefront running at http://localhost:8080.
				fromAddress: '"example" <noreply@example.com>',
				verifyEmailAddressUrl: "http://localhost:8080/verify",
				passwordResetUrl: "http://localhost:8080/password-reset",
				changeEmailAddressUrl:
					"http://localhost:8080/verify-email-address-change",
			},
		}),
		AdminUiPlugin.init({
			route: "admin",
			port: 3002,
			app: {
				path: path.join(__dirname, "/admin-ui/src"),
			},
		}),
	],
};
