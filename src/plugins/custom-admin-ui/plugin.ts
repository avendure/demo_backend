import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import path from "path";

@VendurePlugin({
	imports: [PluginCommonModule],
	compatibility: ">0.0.0",
})
export class AdminUICustomPlugin {
	static ui: AdminUiExtension = {
		extensionPath: path.join(__dirname, "ui"),
		ngModules: [
			{
				type: "shared",
				ngModuleFileName: "adminNavBar.module.ts",
				ngModuleName: "AdminNavBarModule",
			},
		],
	};
}
