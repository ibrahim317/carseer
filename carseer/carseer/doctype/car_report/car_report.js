// Copyright (c) 2025, Softa Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Car Report", {
	refresh(frm) {
		// Calculate vehicle assessment when form loads
		calculate_vehicle_assessment(frm);
	},
	
	issues(frm) {
		calculate_vehicle_assessment(frm);
	},
	
	odometer(frm) {
		calculate_vehicle_assessment(frm);
	},
	
	ownership(frm) {
		calculate_vehicle_assessment(frm);
	},
	
	others(frm) {
		calculate_vehicle_assessment(frm);
	}
});

function calculate_vehicle_assessment(frm) {
	// Get values from all rating fields
	const issues = frm.doc.issues || 0;
	const odometer = frm.doc.odometer || 0;
	const ownership = frm.doc.ownership || 0;
	const others = frm.doc.others || 0;
	
	// Calculate average and floor it to get whole number
	const average = (issues + odometer + ownership + others) / 4;
	const vehicle_assessment = Math.floor(average);
	
	// Set the calculated value
	frm.set_value('vehicle_assessment', vehicle_assessment);
}
