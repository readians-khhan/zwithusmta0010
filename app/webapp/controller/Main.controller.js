sap.ui.define([
	'sap/m/MessageToast',
	"withus/sci/management/SCIManagement/controller/common/BaseController",
	"sap/ui/core/message/Message",
	"sap/ui/core/Fragment",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterType',
	'withus/sci/management/SCIManagement/controller/share/screenData'
], function (MessageToast, BaseController, Message, Fragment, Filter, FilterType, screenData) {
	"use strict";

	return BaseController.extend("withus.sci.management.SCIManagement/controller.Main", {
		onInit: function () {

		},

		// side Navigation 컨트롤
		onCollapseExpandPress: function () {
			var oSideNavigation = this.byId("sideNavigation");
			var bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

	});
	
});