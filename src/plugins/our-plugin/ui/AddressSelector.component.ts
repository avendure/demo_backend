import { Component, ViewChild } from "@angular/core";
import { Address, RelationCustomFieldConfig } from "@vendure/core";
import { FormInputComponent } from "@vendure/admin-ui/core";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { Loader } from "@googlemaps/js-api-loader";

@Component({
	selector: "address-selector",
	template: `<input
		class="input"
		type="text"
		[ngModel]="
			(selectedAddress$ | async)
				? mapAddressData((selectedAddress$ | async)!)
				: ''
		"
		#addresstext
		style="padding: 12px 20px; border: 1px solid #ccc; width: 400px"
	/>`,
})
export class AddressSelectorComponent
	implements FormInputComponent<RelationCustomFieldConfig>
{
	isListInput?: boolean | undefined;
	readonly: boolean;
	formControl: FormControl<any>;
	config: RelationCustomFieldConfig;
	selectedAddress$: Observable<Address>;
	autocomplete: any;

	@ViewChild("addresstext") addresstext: any;

	mapAddressData(address: Address) {
		return "this is the address";
	}

	public ngOnInit() {
		this.initAutocomplete();
	}

	initAutocomplete() {
		const loader = new Loader({
			apiKey: "AIzaSyDrCOqtufcYOXEzIFpexLxfcjsCRcS64dM",
			version: "weekly",
			libraries: ["places"],
		});

		loader.importLibrary("places").then((google) => {
			// Create the autocomplete object, restricting the search predictions to
			// addresses in the US and Canada.
			this.autocomplete = new google.Autocomplete(
				this.addresstext.nativeElement,
				{
					componentRestrictions: { country: ["us", "ca"] },
					fields: ["address_components", "geometry"],
					types: ["address"],
				}
			);

			// When the user selects an address from the drop-down, populate the
			// address fields in the form.
			this.autocomplete.addListener("place_changed", this.fillInAddress);
		});
	}

	fillInAddress() {
		// Get the place details from the autocomplete object.
		const place = this.autocomplete.getPlace();
		let address1 = "";
		let postcode = "";

		// Get each component of the address from the place details,
		// and then fill-in the corresponding field on the form.
		// place.address_components are google.maps.GeocoderAddressComponent objects
		// which are documented at http://goo.gle/3l5i5Mr
		for (const component of place.address_components) {
			// @ts-ignore remove once typings fixed
			const componentType = component.types[0];

			switch (componentType) {
				case "street_number": {
					address1 = `${component.long_name} ${address1}`;
					break;
				}

				case "route": {
					address1 += component.short_name;
					break;
				}

				case "postal_code": {
					postcode = `${component.long_name}${postcode}`;
					break;
				}

				case "postal_code_suffix": {
					postcode = `${postcode}-${component.long_name}`;
					break;
				}

				case "locality":
					(document.querySelector("#locality") as HTMLInputElement).value =
						component.long_name;
					break;

				case "administrative_area_level_1": {
					(document.querySelector("#state") as HTMLInputElement).value =
						component.short_name;
					break;
				}

				case "country":
					(document.querySelector("#country") as HTMLInputElement).value =
						component.long_name;
					break;
			}
		}
	}
}
