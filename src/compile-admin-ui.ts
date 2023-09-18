import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import path from "path";
import { AddressPlugin } from "./plugins/our-plugin/address-plugin";
import { AdminUICustomPlugin } from "./plugins/custom-admin-ui/plugin";

if (require.main === module) {
	// Called directly from command line
	customAdminUi({ recompile: true, devMode: false })
		.compile?.()
		.then(() => {
			process.exit(0);
		});
}

export function customAdminUi(options: {
	recompile: boolean;
	devMode: boolean;
}) {
	const compiledAppPath = path.join(__dirname, "admin-ui");
	if (options.recompile) {
		return compileUiExtensions({
			outputPath: compiledAppPath,
			extensions: [AddressPlugin.uiExtensions, AdminUICustomPlugin.ui],
			devMode: options.devMode,
		});
	} else {
		return {
			path: path.join(compiledAppPath, "./admin-ui/dist"),
		};
	}
}
