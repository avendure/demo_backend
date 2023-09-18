import { NgModule } from "@angular/core";
import {
	SharedModule,
	addNavMenuItem,
	addNavMenuSection,
} from "@vendure/admin-ui/core";

// @NgModule({
// 	imports: [SharedModule],
// 	providers: [
// 		addNavMenuItem(
// 			{
// 				id: "promotions",
// 				label: "Promotions",
// 				routerLink: ["/marketing", "promotions"],
// 				requiresPermission: "SuperAdmin",
// 			},
// 			"marketing"
// 		),
// 	],
// })
@NgModule({})
export class AdminNavBarModule {}
