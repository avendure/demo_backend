import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";
import path from "path";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";

@VendurePlugin({
	imports: [PluginCommonModule],
	adminApiExtensions: {},
	shopApiExtensions: {},
	// configuration: (config) => {
	// 	// config.customFields.Product.push({
	// 	// 	name: "reviewRating",
	// 	// 	label: [{ languageCode: LanguageCode.en, value: "Review rating" }],
	// 	// 	public: true,
	// 	// 	nullable: true,
	// 	// 	type: "float",
	// 	// 	ui: { tab: "Reviews", component: "star-rating-form-input" },
	// 	// });
	// },
})
export class AddressPlugin {
	static uiExtensions: AdminUiExtension = {
		extensionPath: path.join(__dirname, "ui"),
		ngModules: [
			{
				type: "lazy",
				route: "greet",
				ngModuleFileName: "AddressSelector.module.ts",
				ngModuleName: "AddressSelectorModule",
			},
		],
	};
}
