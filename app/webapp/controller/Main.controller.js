sap.ui.define([
	'sap/m/MessageToast',
	"withus/sci/management/SCIManagement/controller/common/BaseController",
	"sap/ui/core/message/Message",
	"sap/ui/core/Fragment",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterType',
	'withus/sci/management/SCIManagement/controller/share/screenData',
	'sap/m/Token',
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem'
], function (MessageToast, BaseController, Message, Fragment, Filter, FilterType, screenData, Token, JSONModel, ColumnListItem) {
	"use strict";

	return BaseController.extend("withus.sci.management.SCIManagement.controller.Main", {

		ControlID: {

			MIInterfaceName: 'MIInterfaceName',
			MIInterfaceNumber: 'MIInterfaceNumber',
			MISSystemName: 'MISSystemName',
			MISApplicationName: 'MISApplicationName',
			MITSystemName: 'MITSystemName',
			MITApplicationName: 'MITApplicationName',
			MISCIPackage: 'MISCIPackage',
			MISCIIf: 'MISCIIf',

			MCIFSorceCompanyCode: 'MCIFSorceCompanyCode',
			MCIFSorceSubsidaryCode: 'MCIFSorceSubsidaryCode',
			MCSApplicationType: 'MCSApplicationType',
			MCSInterfaceProtocol: 'MCSInterfaceProtocol',
			MCTargetCompanyCode: 'MCTargetCompanyCode',
			MCTargetSubsidaryCode: 'MCTargetSubsidaryCode',
			MCTApplicationType: 'MCTApplicationType',
			MCTInterfaceProtocol: 'MCTInterfaceProtocol',
			MCstatus: 'MCstatus',
			MCInterfaceType: 'MCInterfaceType',

			CBdeleted: 'CBdeleted',

			MCIFSorceCompanyCode: 'MCIFSorceCompanyCode',
			InterfaceList: 'InterfaceList'
		},

		MESSAGE_TYPE: {
			CREATE: 'Create',
			UPDATE: 'Update',
			DELETE: 'Delete',
			REFRESH: 'Refresh',
			SEARCH: 'Search'
		},


		/* 
		========================================================== */
		/* Lifecyle
		/* ========================================================== */
		// Initialization 
		onInit: function () {

			// Global
			this._h = this.getDataHub();
			this.bInit = true;

			this.initMultiInput(this);

			// View Model
			this._h.mainView = this.createJSONModel();
			this.getView().setModel(this._h.mainView, 'mainView');
		},

		// Before Rendering
		onBeforeRendering: function () {

		},

		// After Rendering
		onAfterRendering: function (oEvent) {

		},

		// Destory Program
		onExit: function () {

		},


		/* ========================================================== */
		/* Events
		/* ========================================================== */
		// Data Received Event Hander=
		onDR_InterfaceList: function (oEvent) {
			this.showMessageByType(oEvent);
		},

		// side Navigation 컨트롤
		onCollapseExpandPress: function () {
			var oSideNavigation = this.byId("sideNavigation");
			var bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

		// URL Route Event Handler
		onPatternMatched: function (oEvent) {

		},

		// Event Handler
		onPAI: function (oEvent) {
			var sCode = this.getCustomData(oEvent, 'fcCode');

			switch (sCode) {
				case 'fcItemSelect':
					this.fcItemSelect(oEvent);
					break;
				case 'fcSearchInterface':
					this.fcSearchInterface(oEvent);
					break;
				case 'fcCreateIntefaceList':
					this.fcCreateIntefaceList(oEvent);
					break;
				case 'fcCancelInterfaceGeneratePopup':
					this.fcCancelInterfaceGeneratePopup(oEvent);
					break;

				
				case 'fcVHSystem':
					this.fcVHSystem(oEvent);
					break;
				case 'fcValueHelpOkPress':
					this.fcValueHelpOkPress(oEvent);
					break;
				case 'fcValueHelpCancelPress':
					this.fcValueHelpOkPress(oEvent);
					break;
				case 'fcValueHelpAfterClose':
					this.fcValueHelpOkPress(oEvent);
					break;
			}
		},


		//Value Help Logic
		fcValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oInput.setSelectedKey(aTokens[0].getKey());
			this._oValueHelpDialog.close();
		},

		fcValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		fcValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		},

		fcCancelInterfaceGeneratePopup: function (oEvent) {
			this.closePopupFragment('RegisterInterface');
		},

		fcVHSystem: function(oEvent) {
			this.callPopupFragment('ValueHelpSystem');

			this.fragments['ValueHelpSystem'].getTableAsync().then(function (oTable) {
				oTable.setModel(this.oProductsModel);
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "managerment>/");
				}

				this._oValueHelpDialog.update();
			}.bind(this));
		},


		//

		fcCreateIntefaceList: function (oEvent) {


			this.callPopupFragment('Smart', oEvent);
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

			var aInterfaceName = _.map(this.getControl(this.ControlID.MIInterfaceName).getTokens(), oData => {
				return oData.getKey();
			});
			var aInterfaceNumber = _.map(this.getControl(this.ControlID.MIInterfaceNumber).getTokens(), oData => {
				return parseInt(oData.getKey());
			});
			var aSSystemName = _.map(this.getControl(this.ControlID.MISSystemName).getTokens(), oData => {
				return oData.getKey();
			});
			var aSApplicationName = _.map(this.getControl(this.ControlID.MISApplicationName).getTokens(), oData => {
				return oData.getKey();
			});
			var aTSystemName = _.map(this.getControl(this.ControlID.MITSystemName).getTokens(), oData => {
				return oData.getKey();
			});
			var aTApplicationName = _.map(this.getControl(this.ControlID.MITApplicationName).getTokens(), oData => {
				return oData.getKey();
			});
			var aSCIPackage = _.map(this.getControl(this.ControlID.MISCIPackage).getTokens(), oData => {
				return oData.getKey();
			});
			var aSCIIf = _.map(this.getControl(this.ControlID.MISCIIf).getTokens(), oData => {
				return oData.getKey();
			});

			var aIFSorceCompanyCode = this.getControl(this.ControlID.MCIFSorceCompanyCode).getSelectedKeys();
			var aIFSorceSubsidaryCode = this.getControl(this.ControlID.MCIFSorceSubsidaryCode).getSelectedKeys();
			var aSApplicationType = this.getControl(this.ControlID.MCSApplicationType).getSelectedKeys();
			var aSInterfaceProtocol = this.getControl(this.ControlID.MCSInterfaceProtocol).getSelectedKeys();
			var aTargetCompanyCode = this.getControl(this.ControlID.MCTargetCompanyCode).getSelectedKeys();
			var aTargetSubsidaryCode = this.getControl(this.ControlID.MCTargetSubsidaryCode).getSelectedKeys();
			var aTApplicationType = this.getControl(this.ControlID.MCTApplicationType).getSelectedKeys();
			var aTInterfaceProtocol = this.getControl(this.ControlID.MCTInterfaceProtocol).getSelectedKeys();
			var aStatus = this.getControl(this.ControlID.MCstatus).getSelectedKeys();
			var aInterfaceType = this.getControl(this.ControlID.MCInterfaceType).getSelectedKeys();


			var bDeleted = this.getControl(this.ControlID.CBdeleted).getSelected();

			var oTable = this.getControl(this.ControlID.InterfaceList);

			// Created Date Descending 초기화
			if (aInterfaceName.length > 0) {
				aFilters.push({
					field: 'IF_NM',
					op: this.OP.CONTAINS,
					from: aInterfaceName
				});
			}

			if (aInterfaceNumber.length > 0) {
				aFilters.push({
					field: 'IF_NO',
					op: this.OP.EQ,
					from: aInterfaceNumber
				});
			}
			if (aIFSorceCompanyCode.length > 0) {
				aFilters.push({
					field: 'SC_SYS_COMAPANY_CODE',
					op: this.OP.EQ,
					from: aIFSorceCompanyCode
				});
			}
			if (aIFSorceSubsidaryCode.length > 0) {
				aFilters.push({
					field: 'SC_SYS_SUBSIDARY_CODE',
					op: this.OP.EQ,
					from: aIFSorceSubsidaryCode
				});
			}
			if (aSSystemName.length > 0) {
				aFilters.push({
					field: 'SC_SYS_NM',
					op: this.OP.EQ,
					from: aSSystemName
				});
			}
			if (aSApplicationName.length > 0) {
				aFilters.push({
					field: 'SC_SYS_APPL_NM',
					op: this.OP.EQ,
					from: aSApplicationName
				});
			}
			if (aSApplicationType.length > 0) {
				aFilters.push({
					field: 'SC_SYS_APPLTYPE_CODE',
					op: this.OP.EQ,
					from: aSApplicationType
				});
			}
			if (aSInterfaceProtocol.length > 0) {
				aFilters.push({
					field: 'SC_IFTYPE_CODE',
					op: this.OP.EQ,
					from: aSInterfaceProtocol
				});
			}
			if (aTargetCompanyCode.length > 0) {
				aFilters.push({
					field: 'TG_SYS_COMAPANY_CODE',
					op: this.OP.EQ,
					from: aTargetCompanyCode
				});
			}
			if (aTargetSubsidaryCode.length > 0) {
				aFilters.push({
					field: 'TG_SYS_SUBSIDARY_CODE',
					op: this.OP.EQ,
					from: aTargetSubsidaryCode
				});
			}
			if (aTSystemName.length > 0) {
				aFilters.push({
					field: 'TG_SYS_NM',
					op: this.OP.EQ,
					from: aTSystemName
				});
			}
			if (aTApplicationName.length > 0) {
				aFilters.push({
					field: 'TG_SYS_APPL_NM',
					op: this.OP.EQ,
					from: aTApplicationName
				});
			}
			if (aTApplicationType.length > 0) {
				aFilters.push({
					field: 'TG_SYS_APPLTYPE_CODE',
					op: this.OP.EQ,
					from: aTApplicationType
				});
			}
			if (aTInterfaceProtocol.length > 0) {
				aFilters.push({
					field: 'TG_IFTYPE_CODE',
					op: this.OP.EQ,
					from: aTInterfaceProtocol
				});
			}
			if (aStatus.length > 0) {
				aFilters.push({
					field: 'STATUS_CODE',
					op: this.OP.EQ,
					from: aStatus
				});
			}
			if (aInterfaceType.length > 0) {
				aFilters.push({
					field: 'EXECUTION_CODE',
					op: this.OP.EQ,
					from: aInterfaceType
				});
			}
			if (aSCIPackage.length > 0) {
				aFilters.push({
					field: 'PAKCAGE_NM',
					op: this.OP.EQ,
					from: aSCIPackage
				});
			}
			if (aSCIIf.length > 0) {
				aFilters.push({
					field: 'PI_NM',
					op: this.OP.CO,
					from: aSCIIf
				});
			}
			if (!bDeleted) {
				aFilters.push({
					field: 'DELEDTED_TF',
					op: this.OP.EQ,
					from: bDeleted
				});
			}


			var aMultiFilter = this.makeMultiFilter(aFilters, true);


			oTable.getBinding('rows').filter(aMultiFilter);
			this.showMessageToast('msgSuccess120', '20rem', []);
		},

		showMessageByType: function (oEvent) {

			var bError = false;

			if (oEvent.getParameter('error')) {
				bError = true;
			}

			if (this.bInit) {
				return;
			}

			if (bError) {
				switch (this.sMessageType) {
					case this.MESSAGE_TYPE.CREATE:
						this.showMessageToast('msgError07', '20rem', []);
						break;
					case this.MESSAGE_TYPE.REFRESH:
						this.showMessageToast('msgError05', '20rem', []);
						break;
					case this.MESSAGE_TYPE.DELETE:
						this.showMessageToast('msgError01', '20rem', []);
						break;
					case this.MESSAGE_TYPE.UPDATE:
						this.showMessageToast('msgError06', '20rem', []);
						break;
					case this.MESSAGE_TYPE.SEARCH:
						this.showMessageToast('msgError08', '20rem', []);
						break;
				}
			} else {
				switch (this.sMessageType) {
					case this.MESSAGE_TYPE.CREATE:
						this.showMessageToast('msgSuccess16', '20rem', []);
						break;
					case this.MESSAGE_TYPE.REFRESH:
						this.showMessageToast('msgSuccess14', '20rem', []);
						break;
					case this.MESSAGE_TYPE.DELETE:
						this.showMessageToast('msgSuccess05', '20rem', []);
						break;
					case this.MESSAGE_TYPE.UPDATE:
						this.showMessageToast('msgSuccess15', '20rem', []);
						break;
					case this.MESSAGE_TYPE.SEARCH:
						this.showMessageToast('msgSuccess17', '20rem', [oEvent.getSource().getLength()]);
						break;
				}
			}

			this.sMessageType = '';
		},

		initMultiInput: function (self) {

			var fcvalidator = function (args) {
				var text = args.text;

				return new Token({ key: text, text: text });
			}

			self.getView().byId('MIInterfaceName').addValidator(fcvalidator);
			self.getView().byId('MIInterfaceNumber').addValidator(fcvalidator);
			self.getView().byId('MISSystemName').addValidator(fcvalidator);
			self.getView().byId('MISApplicationName').addValidator(fcvalidator);
			self.getView().byId('MITSystemName').addValidator(fcvalidator);
			self.getView().byId('MITApplicationName').addValidator(fcvalidator);
			self.getView().byId('MIInterfaceNumber').addValidator(fcvalidator);
			self.getView().byId('MIInterfaceNumber').addValidator(fcvalidator);
			self.getView().byId('MISCIIf').addValidator(fcvalidator);
			self.getView().byId('MISCIPackage').addValidator(fcvalidator);
		}
	});


});