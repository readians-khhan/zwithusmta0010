sap.ui.define([
	'sap/m/MessageToast',
	"withus/sci/management/SCIManagement/controller/common/BaseController",
	"sap/ui/core/message/Message",
	"sap/ui/core/Fragment",
	'sap/ui/model/Filter',
	"sap/ui/model/FilterOperator",
	'sap/ui/model/FilterType',
	'withus/sci/management/SCIManagement/controller/share/screenData',
	'sap/m/Token',
], function (MessageToast, BaseController, Message, Fragment, Filter, FilterOperator, FilterType, screenData, Token) {
	"use strict";

	return BaseController.extend("withus.sci.management.SCIManagement/controller.Main", {

		CONTROL_ID: {
			// CODE LIST
			tabCodeList: 'tabCodeList',
			MCCDSoruceCt01: 'MCCDSoruceCt01',
			MCCDSoruceCt02: 'MCCDSoruceCt02',
			MCCDSoruceCt03: 'MCCDSoruceCt03',
			MCCDSoruceCd: 'MCCDSoruceCd'
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
			this.bInit = true;

			// View Data Initialization
			this.sMessageType = '';

			// Register Message Model
			this.oMessageManager = sap.ui.getCore().getMessageManager();

			//MultiInput
			this.initMultiInput(this);
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

		onDR_CodeList: function (oEvent) {
			this.showMessageByType(oEvent);
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
			this.fcSearchCode();
		},

		// Event Handler
		onPAI: function (oEvent) {
			var sCode = this.getCustomData(oEvent, 'fcCode');

			switch (sCode) {
				case 'fcItemSelect':
					this.fcItemSelect(oEvent);
					break;
				case 'fcSearchCode':
					this.fcSearchCode(oEvent);
					break;
				case 'fcCodeRefresh':
					this.fcCodeRefresh(oEvent);
					break;
				case 'fcCreateCode':
					this.fcCreateCode(oEvent);
					break;
			}
		},

		fcItemSelect: function (oEvent) {
			var oNavConMain = this.getControl('navConMain');

			switch (oEvent.getParameter('item').getKey()) {
				case 'menu':
					console.log("TEST")
					oNavConMain.getProperty('/sideExpanded') ? oNavConMain.setProperty('/sideExpanded', false) : oNavConMain.setProperty(
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
		},

		// Code List Refresh Function
		fcCodeRefresh: function (oEvent) {

			var oTable = this.getControl(this.CONTROL_ID.tabCodeList);

			var oBinding = oTable.getBinding('rows');

			if (oBinding.hasPendingChanges()) {
				this.showMessageToast('msgWarn02', '20rem', []);
				return;
			}

			this.setMessageType(this.MESSAGE_TYPE.REFRESH);
			oBinding.refresh();
		},

		// Code List Search Function	
		fcSearchCode: function (oEvent) {
			var self = this;
			// 명칭 필터 생성
			var aCodeNameFilters = [];
			// 구분 필터 생성
			var aCAT01Filters = [];
			var oCAT01Filter = null;
			// 상세구분 필터 생성
			var aCAT02Filters = [];
			var oCAT02Filter = null;
			// 기타구분 필터 생성
			var aCAT03Filters = [];
			var oCAT03Filter = null;

			// 컨트롤
			var oControl = this.getControl(this.CONTROL_ID.tabCodeList);
			var oSCCat01 = this.getControl(this.CONTROL_ID.MCCDSoruceCt01);
			var oSCCat02 = this.getControl(this.CONTROL_ID.MCCDSoruceCt02);
			var oSCCat03 = this.getControl(this.CONTROL_ID.MCCDSoruceCt03);

			// 선택 데이터 가져오기
			var oSCCategory01 = oSCCat01.getSelectedKeys();
			var oSCCategory02 = oSCCat02.getSelectedKeys();
			var oSCCategory03 = oSCCat03.getSelectedKeys();

			// 명칭 데이터 가져오기 ( Tokens 임포트 필요)
			var oApplCdTokens = _.map(this.getView().byId("MCCDSoruceCd").getTokens(), oData => {
				return oData.getKey();
			});


			//구분
			if (oSCCategory01.length) {
				aCAT01Filters = _.map(oSCCategory01, function (iStatus) {
					return {
						field: "CAT01",
						op: self.OP.EQ,
						from: iStatus,
					};
				});

				oCAT01Filter = this.makeMultiFilter(aCAT01Filters, false);
			}

			//상세구분
			if (oSCCategory02.length) {
				aCAT02Filters = _.map(oSCCategory02, function (iStatus) {
					return {
						field: "CAT02",
						op: self.OP.EQ,
						from: iStatus,
					};
				});

				oCAT02Filter = this.makeMultiFilter(aCAT02Filters, false);
			}

			//상세구분
			if (oSCCategory03.length) {
				aCAT03Filters = _.map(oSCCategory03, function (iStatus) {
					return {
						field: "CAT03",
						op: self.OP.EQ,
						from: iStatus,
					};
				});

				oCAT03Filter = this.makeMultiFilter(aCAT03Filters, false);
			}

			//어플리케이션 명
			if (oApplCdTokens.length > 0) {
				aCodeNameFilters.push({
					field: "CODE",
					op: this.OP.CONTAINS,
					from: oApplCdTokens,
				});
			}

			// 통합 필터
			var aFilterObjects = [];

			// 구분 검색 필터 생성
			if (oCAT01Filter) {
				aFilterObjects.push(oCAT01Filter);
			}

			// 상세구분 검색 필터 생성
			if (oCAT02Filter) {
				aFilterObjects.push(oCAT02Filter);
			}

			// 기타구분 검색 필터 생성
			if (oCAT03Filter) {
				aFilterObjects.push(oCAT03Filter);
			}

			// 통합필터에 명칭 검색 필터 Push 
			if (aCodeNameFilters.length) {
				aFilterObjects.push(this.makeMultiFilter(aCodeNameFilters, true));
			}

			this.setMessageType(this.MESSAGE_TYPE.SEARCH);

			oControl.getBinding("rows").filter(aFilterObjects);
		},

		fcCreateCode: function (oEvent) {
			console.log("생성")

			this.callPopupFragment('RegisterInterface', oEvent);
		},

		fcCancelPopStorageLocation: function (oEvent) {
			this.oMessageManager.removeAllMessages();
			this.closePopupFragment('RegisterStorageLocation');
		},

		/* ========================================================== */
		/* Local Methods
		/* ========================================================== */
		initMultiInput: function (self) {

			var fcvalidator = function (args) {
				var text = args.text;

				return new Token({ key: text, text: text });
			}

			self.getView().byId("MCCDSoruceCd").addValidator(fcvalidator);
		},

		setMessageType: function (sType) {
			this.sMessageType = sType;

			this.oMessageManager.removeAllMessages();
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
		}

	});
});