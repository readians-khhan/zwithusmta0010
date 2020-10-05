/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sci/withus/SCIManagement/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});