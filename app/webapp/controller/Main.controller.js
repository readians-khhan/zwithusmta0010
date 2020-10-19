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

		// Event Handler
		onPAI: function (oEvent) {
			var sCode = this.getCustomData(oEvent, 'fcCode');

			switch (sCode) {
				case 'fcItemSelect':
					this.fcItemSelect(oEvent);
					break;
			}
		},

		fcItemSelect: function (oEvent) {
			var oNavConMain = this.getControl('navConMain');

			switch (oEvent.getParameter('item').getKey()) {
				case 'menu':
					this._h.mainView.getProperty('/sideExpanded') ? this._h.mainView.setProperty('/sideExpanded', false) : this._h.mainView.setProperty(
						'/sideExpanded', true);
					break;
				case 'interfaceList':
					this.getView().byId('tabFileList__bDelete').setEnabled(false);
					oNavConMain.to(this.getControl('dp-interface'), 'slide');
					break;
				case 'codeList':
					oNavConMain.to(this.getControl('dp-code'), 'slide');
					break;
				case 'systemList':
					oNavConMain.to(this.getControl('dp-system'), 'slide');
					break;
				case 'exception':
					oNavConMain.to(this.getControl('dp-exception'), 'slide');
					break;
			}
		},


		fcSearchInterface: function (oEvent) {

			var self = this;
			var aFilters = [];
			var aFiltersFileStatus = [];
			var aFiltersMovementsStatus = [];
			var aFiltersConfirmationStatus = [];
			var oStatusFileFilter = null;
			var oStatusMovementFilter = null;
			var oStatusConfirmationFilter = null;
			var oCondition = this._h.mainView.getProperty('/Files/condition');
			var oControl = this.getControl(this.CONTROL_ID.tabFileList);

			var aFileNameTokens = _.map(this.getView().byId("MIInterfaceName").getTokens(), oData => {
				return oData.getKey();
			});

			// Created Date Descending 초기화
			var oTable = this.getView().byId('tabFileList');
			var oColumnCreatedDate = this.getView().byId(
				'tabFileList__CreatedDate'
			);

			oTable.sort(
				oColumnCreatedDate,
				library.SortOrder.Descending,
				true
			);

			if (oCondition.fromDate) {
				aFilters.push({
					field: 'fileCreatedDate',
					op: this.OP.BT,
					from: oCondition.fromDate.toISOString(),
					to: oCondition.toDate.toISOString().replace(/T\d{2}:\d{2}:\d{2}\.\d{3}/igm, 'T23:59:59.999')
				});
			}

			if (oCondition.postingfromDate) {
				aFilters.push({
					field: 'postingDate',
					op: this.OP.BT,
					from: moment(oCondition.postingfromDate).format('YYYY-MM-DD'),
					to: moment(oCondition.postingtoDate).format('YYYY-MM-DD')
				});
			}



			if (aFileNameTokens.length > 0) {

				aFilters.push({
					field: 'fileName',
					op: this.OP.CONTAINS,
					from: aFileNameTokens
				});
			}

			if (oCondition.fileStatus.length) {
				aFiltersFileStatus = _.map(oCondition.fileStatus, function (iStatus) {
					if (iStatus === '0') {
						return {
							field: 'isDeleted',
							op: self.OP.EQ,
							from: false
						};
					} else if (iStatus === '1') {
						return {
							field: 'isDeleted',
							op: self.OP.EQ,
							from: true
						};
					}
				});

				oStatusFileFilter = this.makeMultiFilter(aFiltersFileStatus, false);
			}

			if (oCondition.movementStatus.length) {
				aFiltersMovementsStatus = _.map(oCondition.movementStatus, function (iStatus) {
					return {
						field: 'movementStatus',
						op: self.OP.EQ,
						from: iStatus
					};
				});

				oStatusMovementFilter = this.makeMultiFilter(aFiltersMovementsStatus, false);
			}

			if (oCondition.confirmationStatus.length) {
				aFiltersConfirmationStatus = _.map(oCondition.confirmationStatus, function (iStatus) {
					return {
						field: 'confirmationStatus',
						op: self.OP.EQ,
						from: iStatus
					};
				});

				oStatusConfirmationFilter = this.makeMultiFilter(aFiltersConfirmationStatus, false);
			}

			var aFilterObjects = [];

			if (aFilters.length) {
				aFilterObjects.push(this.makeMultiFilter(aFilters, true));
			}

			if (oStatusFileFilter) {
				aFilterObjects.push(oStatusFileFilter);
			}

			if (oStatusMovementFilter) {
				aFilterObjects.push(oStatusMovementFilter);
			}

			if (oStatusConfirmationFilter) {
				aFilterObjects.push(oStatusConfirmationFilter);
			}

			this.setMessageType(this.MESSAGE_TYPE.SEARCH);

			oControl.getBinding('rows').filter(aFilterObjects);
		}

	});
	
});