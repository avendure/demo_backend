import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@vendure/admin-ui/core";
import { AddressSelectorComponent } from "./AddressSelector.component";

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: "",
				pathMatch: "full",
				component: AddressSelectorComponent,
				data: { breadcrumb: "Greeter" },
			},
		]),
	],
	declarations: [AddressSelectorComponent],
})
export class AddressSelectorModule {}
