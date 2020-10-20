sap.ui.define(
  [
    "sap/m/MessageToast",
    "withus/sci/management/SCIManagement/controller/common/BaseController",
    "sap/ui/core/message/Message",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterType",
    "withus/sci/management/SCIManagement/controller/share/screenData",
  ],
  function (
    MessageToast,
    BaseController,
    Message,
    Fragment,
    Filter,
    FilterType,
    screenData
  ) {
    "use strict";

    return BaseController.extend(
      "withus.sci.management.SCIManagement/controller.Main",
      {
        CONTROL_ID: {
          // System List
		  tabSystemList: "tabSystemList",
		  McSLSorceCompanyCd: "McSLSorceCompanyCd",
		  McSLSorceSubsidiaryCd: "McSLSorceSubsidiaryCd",
        },

        MESSAGE_TYPE: {
          CREATE: "Create",
          UPDATE: "Update",
          DELETE: "Delete",
          REFRESH: "Refresh",
          SEARCH: "Search",
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

          // View Model
          this._h.mainView = this.createJSONModel();
          this._h.mainView.setData(this._h.mainViewInitData);

          // Data Model
          this._h.mainData = this.createJSONModel();
          this._h.mainData.setData(this._h.mainDataInitData);

          // Message Model
          this._h.mainMessage = this.createJSONModel();

          // Register Model
          this.getView().setModel(this._h.mainView, "mainView");
          this.getView().setModel(this._h.mainData, "mainData");
          this.getView().setModel(this._h.mainMessage, "mainMessage");

          // Register Event
          this.getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched, this);

          // Register Message Model
          this.oMessageManager = sap.ui.getCore().getMessageManager();
          this.oMessageModel = this.oMessageManager.getMessageModel();
          this.oMessageModelBinding = this.oMessageModel.bindList("/", undefined, []);
          this.getView().setModel(this.oMessageModel, "message");
          this.oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
          this.oMessageManager.registerObject(this.getView(), true);

          // View Data Initialization
          this.sMessageType = "";
        },

        // Before Rendering
        onBeforeRendering: function () {},

        // After Rendering
        onAfterRendering: function (oEvent) {},

        // Destory Program
        onExit: function () {},

        /* ========================================================== */
        /* Events
		/* ========================================================== */
        // Data Received Event Hander=
        onDR_InterfaceList: function (oEvent) {
          this.showMessageByType(oEvent);
        },

        onDR_SystemList: function (oEvent) {
          this.showMessageByType(oEvent);
          this._h.mainView.setProperty("/SystemList/totalCount", oEvent.getSource().getLength());
        },

        // side Navigation 컨트롤
        onCollapseExpandPress: function () {
          var oSideNavigation = this.byId("sideNavigation");
          var bExpanded = oSideNavigation.getExpanded();

          oSideNavigation.setExpanded(!bExpanded);
        },

        // URL Route Event Handler
        onPatternMatched: function (oEvent) {},

        // Event Handler
        onPAI: function (oEvent) {
          var sCode = this.getCustomData(oEvent, "fcCode");

          switch (sCode) {
            case "fcItemSelect":
              this.fcItemSelect(oEvent);
              break;

            //System List
            case "fcSearchSystemList":
              this.fcSearchSystemList(oEvent);
              break;
            case "fcRefreshSystemList":
              this.fcRefreshSystemList(oEvent);
              break;
            case "fcSelectionChangeSystemList":
              this.fcSelectionChangeSystemList(oEvent);
              break;
            case "fcDeleteSystemList":
              this.fcDeleteSystemList(oEvent);
              break;
          }
        },

        fcItemSelect: function (oEvent) {
          var oNavConMain = this.getControl("navConMain");

          switch (oEvent.getParameter("item").getKey()) {
            case "menu":
              this._h.mainView.getProperty("/sideExpanded")
                ? this._h.mainView.setProperty("/sideExpanded", false)
                : this._h.mainView.setProperty("/sideExpanded", true);
              break;
            case "interfaceList":
              this.getView().byId("tabFileList__bDelete").setEnabled(false);
              oNavConMain.to(this.getControl("dp-interface"), "slide");
              break;
            case "codeList":
              oNavConMain.to(this.getControl("dp-code"), "slide");
              break;
            case "systemList":
              oNavConMain.to(this.getControl("dp-system"), "slide");
              break;
            case "exception":
              oNavConMain.to(this.getControl("dp-exception"), "slide");
              break;
          }
        },

        fcSearchInterface: function (oEvent) {
          //   var self = this;
          //   var aFilters = [];
          //   var aFiltersFileStatus = [];
          //   var aFiltersMovementsStatus = [];
          //   var aFiltersConfirmationStatus = [];
          //   var oStatusFileFilter = null;
          //   var oStatusMovementFilter = null;
          //   var oStatusConfirmationFilter = null;
          //   var oCondition = this._h.mainView.getProperty("/Files/condition");
          //   var oControl = this.getControl(this.CONTROL_ID.tabFileList);
          //   var aFileNameTokens = _.map(
          //     this.getView().byId("MIInterfaceName").getTokens(),
          //     (oData) => {
          //       return oData.getKey();
          //     }
          //   );
          //   // Created Date Descending 초기화
          //   var oTable = this.getView().byId("tabFileList");
          //   var oColumnCreatedDate = this.getView().byId(
          //     "tabFileList__CreatedDate"
          //   );
          //   oTable.sort(oColumnCreatedDate, library.SortOrder.Descending, true);
          //   if (oCondition.fromDate) {
          //     aFilters.push({
          //       field: "fileCreatedDate",
          //       op: this.OP.BT,
          //       from: oCondition.fromDate.toISOString(),
          //       to: oCondition.toDate
          //         .toISOString()
          //         .replace(/T\d{2}:\d{2}:\d{2}\.\d{3}/gim, "T23:59:59.999"),
          //     });
          //   }
          //   if (oCondition.postingfromDate) {
          //     aFilters.push({
          //       field: "postingDate",
          //       op: this.OP.BT,
          //       from: moment(oCondition.postingfromDate).format("YYYY-MM-DD"),
          //       to: moment(oCondition.postingtoDate).format("YYYY-MM-DD"),
          //     });
          //   }
          //   if (aFileNameTokens.length > 0) {
          //     aFilters.push({
          //       field: "fileName",
          //       op: this.OP.CONTAINS,
          //       from: aFileNameTokens,
          //     });
          //   }
          //   if (oCondition.fileStatus.length) {
          //     aFiltersFileStatus = _.map(oCondition.fileStatus, function (
          //       iStatus
          //     ) {
          //       if (iStatus === "0") {
          //         return {
          //           field: "isDeleted",
          //           op: self.OP.EQ,
          //           from: false,
          //         };
          //       } else if (iStatus === "1") {
          //         return {
          //           field: "isDeleted",
          //           op: self.OP.EQ,
          //           from: true,
          //         };
          //       }
          //     });
          //     oStatusFileFilter = this.makeMultiFilter(aFiltersFileStatus, false);
          //   }
          //   if (oCondition.movementStatus.length) {
          //     aFiltersMovementsStatus = _.map(
          //       oCondition.movementStatus,
          //       function (iStatus) {
          //         return {
          //           field: "movementStatus",
          //           op: self.OP.EQ,
          //           from: iStatus,
          //         };
          //       }
          //     );
          //     oStatusMovementFilter = this.makeMultiFilter(
          //       aFiltersMovementsStatus,
          //       false
          //     );
          //   }
          //   if (oCondition.confirmationStatus.length) {
          //     aFiltersConfirmationStatus = _.map(
          //       oCondition.confirmationStatus,
          //       function (iStatus) {
          //         return {
          //           field: "confirmationStatus",
          //           op: self.OP.EQ,
          //           from: iStatus,
          //         };
          //       }
          //     );
          //     oStatusConfirmationFilter = this.makeMultiFilter(
          //       aFiltersConfirmationStatus,
          //       false
          //     );
          //   }
          //   var aFilterObjects = [];
          //   if (aFilters.length) {
          //     aFilterObjects.push(this.makeMultiFilter(aFilters, true));
          //   }
          //   if (oStatusFileFilter) {
          //     aFilterObjects.push(oStatusFileFilter);
          //   }
          //   if (oStatusMovementFilter) {
          //     aFilterObjects.push(oStatusMovementFilter);
          //   }
          //   if (oStatusConfirmationFilter) {
          //     aFilterObjects.push(oStatusConfirmationFilter);
          //   }
          //   this.setMessageType(this.MESSAGE_TYPE.SEARCH);
          //   oControl.getBinding("rows").filter(aFilterObjects);
        },

        //System List
        fcSearchSystemList: function (oEvent) {
          var self = this;
          var aFilters = [];
          var aCompanyFilters = [];
          var aSubsidaryFilters = [];
          var oCompanyFilter = null;
          var oSubsidaryFilter = null;
          var oControl = this.getControl(this.CONTROL_ID.tabSystemList);
          var oSCCompany = this.getControl(this.CONTROL_ID.McSLSorceCompanyCd);
          var oSCSubsidary = this.getControl(this.CONTROL_ID.McSLSorceSubsidiaryCd);
          var oApplNmTokens = _.map(
            this.getView().byId("ApplicaitonName").getTokens(),
            (oData) => {
              return oData.getKey();
            }
		  );
		  
		  var oSCCompany = oSCCompany.getSelectedKeys();
          var oSCSubsidary = oSCSubsidary.getSelectedKeys();

          //회사
          if (oSCCompany) {
            aCompanyFilters.push({
			  field: "COMPANY_CD/CODE",
              op: self.OP.EQ,
              from: oSCCompany,
            });

            oCompanyFilter = this.makeMultiFilter(aCompanyFilters, false);
		  }
		  console.log(oCompanyFilter);

          //자회사
          if (oSCSubsidary) {
            aSubsidaryFilters.push({
              field: "SUBSIDARY_CD/CODE",			
			  op: self.OP.EQ,
              from: oSCCompany,
            });

            oSubsidaryFilter = this.makeMultiFilter(aSubsidaryFilters, false);
		  }
		  console.log(oSubsidaryFilter);

          //어플리케이션 명
          if (oApplNmTokens.length > 0) {
            aFilters.push({
              field: "APPL_NM",
              op: this.OP.CONTAINS,
              from: oApplNmTokens,
            });
          }

          var aFilterObjects = [];

          if (oCompanyFilter) {
            aFilterObjects.push(oCompanyFilter);
          }

          if (oSubsidaryFilter) {
            aFilterObjects.push(oSubsidaryFilter);
          }

          if (aFilters.length) {
            aFilterObjects.push(this.makeMultiFilter(aFilters, true));
          }

          this.setMessageType(this.MESSAGE_TYPE.SEARCH);

          oControl.getBinding("rows").filter(aFilterObjects);
        },

        fcSelectionChangeSystemList: function (oEvent) {
          this._h.mainView.setProperty(
            "/SystemList/selectedCount",
            oEvent.getSource().getSelectedIndices().length
          );
        },

        showMessageByType: function (oEvent) {
          var bError = false;

          if (oEvent.getParameter("error")) {
            bError = true;
          }

          if (this.bInit) {
            return;
          }

          if (bError) {
            switch (this.sMessageType) {
              case this.MESSAGE_TYPE.CREATE:
                this.showMessageToast("msgError07", "20rem", []);
                break;
              case this.MESSAGE_TYPE.REFRESH:
                this.showMessageToast("msgError05", "20rem", []);
                break;
              case this.MESSAGE_TYPE.DELETE:
                this.showMessageToast("msgError01", "20rem", []);
                break;
              case this.MESSAGE_TYPE.UPDATE:
                this.showMessageToast("msgError06", "20rem", []);
                break;
              case this.MESSAGE_TYPE.SEARCH:
                this.showMessageToast("msgError08", "20rem", []);
                break;
            }
          } else {
            switch (this.sMessageType) {
              case this.MESSAGE_TYPE.CREATE:
                this.showMessageToast("msgSuccess16", "20rem", []);
                break;
              case this.MESSAGE_TYPE.REFRESH:
                this.showMessageToast("msgSuccess14", "20rem", []);
                break;
              case this.MESSAGE_TYPE.DELETE:
                this.showMessageToast("msgSuccess05", "20rem", []);
                break;
              case this.MESSAGE_TYPE.UPDATE:
                this.showMessageToast("msgSuccess15", "20rem", []);
                break;
              case this.MESSAGE_TYPE.SEARCH:
                this.showMessageToast("msgSuccess17", "20rem", [
                  oEvent.getSource().getLength(),
                ]);
                break;
            }
          }

          this.sMessageType = "";
        },

        setMessageType: function (sType) {
          this.sMessageType = sType;

          this.oMessageManager.removeAllMessages();
		}
		

      }
    );
  }
);
