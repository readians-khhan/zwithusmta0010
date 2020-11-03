sap.ui.define(
  [
    "sap/m/MessageToast",
    "withus/sci/management/SCIManagement/controller/common/BaseController",
    "sap/ui/core/message/Message",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "withus/sci/management/SCIManagement/controller/share/screenData",
    "sap/m/Token",
  ],
  function (
    MessageToast,
    BaseController,
    Message,
    Fragment,
    Filter,
    FilterOperator,
    FilterType,
    screenData,
    Token
  ) {
    "use strict";

    return BaseController.extend(
      "withus.sci.management.SCIManagement.controller.Main",
      {
        ControlID: {
          //-------------------------------------------------------------------------------------------
          //Interface List
          MIInterfaceName: "MIInterfaceName",
          MIInterfaceNumber: "MIInterfaceNumber",
          MISSystemName: "MISSystemName",
          MISApplicationName: "MISApplicationName",
          MITSystemName: "MITSystemName",
          MITApplicationName: "MITApplicationName",
          MISCIPackage: "MISCIPackage",
          MISCIIf: "MISCIIf",

          MCIFSorceCompanyCode: "MCIFSorceCompanyCode",
          MCIFSorceSubsidaryCode: "MCIFSorceSubsidaryCode",
          MCSApplicationType: "MCSApplicationType",
          MCSInterfaceProtocol: "MCSInterfaceProtocol",
          MCTargetCompanyCode: "MCTargetCompanyCode",
          MCTargetSubsidaryCode: "MCTargetSubsidaryCode",
          MCTApplicationType: "MCTApplicationType",
          MCTInterfaceProtocol: "MCTInterfaceProtocol",
          MCstatus: "MCstatus",
          MCInterfaceType: "MCInterfaceType",

          CBdeleted: "CBdeleted",

          CbcCycle: "CbcCycle",
          CbcRecurrecn: "CbcRecurrecn",
          CbcInterval: "CbcInterval",
          CSSType: "CSSType",
          CTSType: "CTSType",

          DPOnDate: "DPOnDate",

          TPFrTime: "TPFrTime",
          TPToTime: "TPToTime",

          ITimezone: "ITimezone",
          IRFC: "IRFC",
          IES: "IES",
          IWS: "IWS",
          IWSB: "IWSB",

          ISourceSystem: "ISourceSystem",
          ITargetSystem: "ITargetSystem",

          MCIFSorceCompanyCode: "MCIFSorceCompanyCode",
          tabInterfaceList: "tabInterfaceList",
          tabBatchList: "tabBatchList",
          InterfaceDataGroup: "InterfaceDataGroup",

          //-------------------------------------------------------------------------------------------
          // CODE LIST
          tabCodeList: "tabCodeList",
          MCCDSoruceCt01: "MCCDSoruceCt01",
          MCCDSoruceCt02: "MCCDSoruceCt02",
          MCCDSoruceCt03: "MCCDSoruceCt03",
          MCCDSoruceCd: "MCCDSoruceCd",
          codeListDataGroup: "codeListDataGroup",
          AddCodeList: "AddCodeList",
          AddCodeLiCat01: "AddCodeLiCat01",
          AddCodeLiCat02: "AddCodeLiCat02",
          AddCodeLiCat03: "AddCodeLiCat03",
          formUpdateCodeList: "formUpdateCodeList",
          UpdateCodeList: "UpdateCodeList",
          SLCodedeleted: "SLCodedeleted",

          //-------------------------------------------------------------------------------------------

          // System List
          tabSystemList: "tabSystemList",
          tabSystemList__bDelete: "tabSystemList__bDelete",
          tbSystemManager: "tbSystemManager",
          systemListDataGroup: "systemListDataGroup",
          McSLSorceCompanyCd: "McSLSorceCompanyCd",
          McSLSorceSubsidiaryCd: "McSLSorceSubsidiaryCd",
          MiSystemAppNm: "MiSystemAppNm",
          SLCbdeleted: "SLCbdeleted",
          SystemListManager: "SystemListManager",

          //--- Add Pop Up ---
          AddSystemList: "AddSystemList",
          AddSysLiCompanyCd: "AddSysLiCompanyCd",
          AddSysLiSubdiaryCd: "AddSysLiSubdiaryCd",
          AddSysLiAppliCd: "AddSysLiAppliCd",
          tabAddMangerList: "tabAddMangerList",
          dialogAddSystemList: "dialogAddSystemList",

          //--- Update Pop Up ---
          UpdateSystemList: "UpdateSystemList",
          dialogUpdateSystemList: "dialogUpdateSystemList",
          formUpdateSystemList: "formUpdateSystemList",
          UpdateSysLiCompanyCd: "UpdateSysLiCompanyCd",
          UpdateSysLiSubdiaryCd: "UpdateSysLiSubdiaryCd",
          UpdateSysLiAppliCd: "UpdateSysLiAppliCd",
          tabUpdateMangerList: "tabUpdateMangerList",
        },

        MESSAGE_TYPE: {
          CREATE: "Create",
          UPDATE: "Update",
          DELETE: "Delete",
          REFRESH: "Refresh",
          SEARCH: "Search",
        },

        /* ========================================================== */
        /* Lifecyle */
        /* ========================================================== */
        // Initialization
        onInit: function () {
          // Global
          this._h = this.getDataHub();
          this.bInit = true;

          // View Data Initialization
          this.sMessageType = "";

          // View Model
          this._h.mainView = this.createJSONModel();
          this._h.mainView.setData(this._h.mainViewInitData);

          // Register Message Model
          this.oMessageManager = sap.ui.getCore().getMessageManager();
          this.oMessageModel = this.oMessageManager.getMessageModel();
          this.oMessageModelBinding = this.oMessageModel.bindList(
            "/",
            undefined,
            []
          );
          this.getView().setModel(this.oMessageModel, "message");
          this.oMessageModelBinding.attachChange(
            this.onMessageBindingChange,
            this
          );
          this.oMessageManager.registerObject(this.getView(), true);

          // Register Event
          this.getRouter()
            .getRoute("main")
            .attachPatternMatched(this.onPatternMatched, this);

          this.getView().setModel(this._h.mainView, "mainView");
          this.getView().setModel(this._h.mainMessage, "mainMessage");

          // Multi Input Initialization
          this.initMultiInput(this);
        },

        // Before Rendering
        onBeforeRendering: function () {},

        // After Rendering
        onAfterRendering: function (oEvent) {},

        // Destory Program
        onExit: function () {},

        /* ========================================================== */
        /* Events */
        /* ========================================================== */

        // Data Received Event Handler
        onDR_InterfaceList: function (oEvent) {
          this.showMessageByType(oEvent);
        },

        onDR_CodeList: function (oEvent) {
          this.showMessageByType(oEvent);
          this._h.mainView.setProperty(
            "/CodeList/totalCount",
            oEvent.getSource().getLength()
          );
        },

        onDR_SystemList: function (oEvent) {
          this.showMessageByType(oEvent);
          this._h.mainView.setProperty(
            "/SystemList/totalCount",
            oEvent.getSource().getLength()
          );
        },

        // side Navigation 컨트롤
        onCollapseExpandPress: function () {
          var oSideNavigation = this.byId("sideNavigation");
          var bExpanded = oSideNavigation.getExpanded();

          oSideNavigation.setExpanded(!bExpanded);
        },

        // URL Route Event Handler
        onPatternMatched: function (oEvent) {
          this.fcSearchInterface();
          this.fcSearchCode();
          this.fcSearchSystemList();
        },

        //Value Help event Handler
        onValueHelp: function (oEvent) {
          var sCode = this.getCustomData(oEvent, "vhCode");
          switch (sCode) {
            case "fcVHSSystem":
              this.fcVHSSystem(oEvent);
              break;
            case "fcVHTSystem":
              this.fcVHTSystem(oEvent);
              break;
          }
        },

        // Event Handler
        onPAI: function (oEvent) {
          var sCode = this.getCustomData(oEvent, "fcCode");

          switch (sCode) {
            // Interface List
            case "fcItemSelect":
              this.fcItemSelect(oEvent);
              break;
            case "fcCreateIntefaceList":
              this.fcCreateIntefaceList(oEvent);
              break;
            case "fcCreateInterfacePopup":
              this.fcCreateInterfacePopup(oEvent);
              break;
            case "fcCancelInterfacePopup":
              this.fcCancelInterfacePopup(oEvent);
              break;
            case "fcSearchInterface":
              this.fcSearchInterface(oEvent);
              break;
            case "fcInterfaceRefresh":
              this.fcInterfaceRefresh(oEvent);
              break;
            case "fcAddBatchList":
              this.fcAddBatchList(oEvent);
              break;
            case "fcChangeCbcExecType":
              this.fcChangeCbcExecType(oEvent);
              break;
            case "fcChangeCbcCycle":
              this.fcChangeCbcCycle(oEvent);
              break;
            case "fcChangeSystem":
              this.fcChangeSystem(oEvent);
              break;
            case "fcChangeBatch":
              this.fcChangeBatch(oEvent);
              break;
            case "fcCreateInterfacePopupElementDelete":
              this.fcCreateInterfacePopupElementDelete(oEvent);
              break;
            case "fcInterfaceBatchList":
              this.fcInterfaceRefresh(oEvent);
              break;
            case "fcshowBatchList":
              this.fcshowBatchList(oEvent);
              break;
            case "fcEditInterfaceList":
              this.fcEditInterfaceList(oEvent);
              break;
            case "fcCancelEditInterfacePopup":
              this.fcCancelEditInterfacePopup(oEvent);
              break;

            // Code List
            case "fcSearchCode":
              this.fcSearchCode(oEvent);
              break;
            case "fcCodeRefresh":
              this.fcCodeRefresh(oEvent);
              break;
            case "fcCreateCode":
              this.fcCreateCode(oEvent);
              break;
            case "fcSelectionChangeCodeList":
              this.fcSelectionChangeCodeList(oEvent);
              break;
            case "fcDeleteCodeList":
              this.fcDeleteCodeList(oEvent);
              break;
            case "fcUpdateCodeList":
              this.fcUpdateCodeList(oEvent);
              break;

            // Code Create Popup
            case "fcCancelAddCodePopup":
              this.fcCancelAddCodePopup(oEvent);
              break;
            case "fcConfirmAddCodePopup":
              this.fcConfirmAddCodePopup(oEvent);
              break;

            // Code Update Popup
            case "fcCancelUpdateCodePopup":
              this.fcCancelUpdateCodePopup(oEvent);
              break;
            case "fcConfirmUpdateCodePopup":
              this.fcConfirmUpdateCodePopup(oEvent);
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
            case "fcManagerPopUp":
              this.fcManagerPopUp(oEvent);
              break;
            case "fcCloseSystemListManagerPopUp":
              this.fcCloseSystemListManagerPopUp(oEvent);
              break;
            //---- Add Popup ----
            case "fcCreateSystemList":
              this.fcCreateSystemList(oEvent);
              break;
            case "fcAddSystemListPopup":
              this.fcAddSystemListPopup(oEvent);
              break;
            case "fcCancelAddSystemListPopUp":
              this.fcCancelAddSystemListPopUp(oEvent);
              break;
            case "fcAddManager":
              this.fcAddManager(oEvent);
              break;
            case "fcDeleteManager":
              this.fcDeleteManager(oEvent);
              break;
            //---- Update Popup ----
            case "fcUpdateSystemList":
              this.fcUpdateSystemList(oEvent);
              break;
            case "fcUpdateSystemListPopup":
              this.fcUpdateSystemListPopup(oEvent);
              break;
            case "fcCancelUpdateSystemListPopUp":
              this.fcCancelUpdateSystemListPopUp(oEvent);
              break;
            case "fcUpdateManager":
              this.fcUpdateManager(oEvent);
              break;
            case "fcDeleteManagerUpdate":
              this.fcDeleteManagerUpdate(oEvent);
              break;
            //---- Delete ----
            case "fcDeleteSystemList":
              this.fcDeleteSystemList(oEvent);
              break;

            // Commons
            case "fcMessage":
              this.fcMessage(oEvent);
              break;
            case "fcCheckCHOnlyInputKey":
              this.fcCheckCHOnlyInputKey(oEvent);
          }
        },

        fcItemSelect: function (oEvent) {
          var oNavConMain = this.getControl("navConMain");

          switch (oEvent.getParameter("item").getKey()) {
            case "menu":
              oNavConMain.getProperty("/sideExpanded")
                ? oNavConMain.setProperty("/sideExpanded", false)
                : oNavConMain.setProperty("/sideExpanded", true);
              break;
            case "interfaceList":
              oNavConMain.to(this.getControl("dp-interface"), "slide");
              break;
            case "codeList":
              oNavConMain.to(this.getControl("dp-code"), "slide");
              break;
            case "systemList":
              this.getView().byId("tabSystemList__bDelete").setEnabled(false);
              oNavConMain.to(this.getControl("dp-system"), "slide");
              break;
            case "exception":
              oNavConMain.to(this.getControl("dp-exception"), "slide");
              break;
          }
        },

        //------------------------- Common Start -------------------------------------------

        fcMessage: function (oEvent) {
          if (!this.fragments["Messages"]) {
            var sFragmentName =
              this._h.nameSpace + ".view.fragments." + "Messages";
            this.fragments["Messages"] = sap.ui.xmlfragment(
              sFragmentName,
              this
            );
            this.getView().addDependent(this.fragments["Messages"]);
          }
          this.fragments["Messages"].openBy(oEvent.getSource());
        },

        fcCheckCHOnlyInputKey: function (oEvent) {
          var oInput = oEvent.getSource();
          var bValid = !oInput.getSelectedKey();
          oInput.setValueState(bValid ? "Error" : "None");
        },

        //Combox Selection Change
        onSelectionChange: function (oEvent) {
          //__xmlview0 앞에 붙어서 substring
          var sId = oEvent.getSource().sId.substring(12);

          if (sId == "AddSysLiCompanyCd") {
            this._h.mainView.setProperty(
              "/SystemList/Add/company",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "AddSysLiSubdiaryCd") {
            this._h.mainView.setProperty(
              "/SystemList/Add/subdiary",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "AddSysLiAppliCd") {
            this._h.mainView.setProperty(
              "/SystemList/Add/appliCd",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "UpdateSysLiCompanyCd") {
            this._h.mainView.setProperty(
              "/SystemList/Update/company",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "UpdateSysLiSubdiaryCd") {
            this._h.mainView.setProperty(
              "/SystemList/Update/subdiary",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "UpdateSysLiAppliCd") {
            this._h.mainView.setProperty(
              "/SystemList/Update/appliCd",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "AddCodeLiCat01") {
            this._h.mainView.setProperty(
              "/CodeList/Add/cat01",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "AddCodeLiCat02") {
            this._h.mainView.setProperty(
              "/CodeList/Add/cat02",
              oEvent.getSource().getSelectedKey()
            );
          } else if (sId == "AddCodeLiCat03") {
            this._h.mainView.setProperty(
              "/CodeList/Add/cat03",
              oEvent.getSource().getSelectedKey()
            );
          }
        },

        setUIChanges: function (oModel, bHasUIChanges) {
          // Error : set true
          // Model has pending changes : set true
          if (this.checkError()) {
            // There are technical errors, set ui change status to true
            bHasUIChanges = true;
          } else if (bHasUIChanges === undefined) {
            // Check model pending changes exists. It has pending changes, then ui change status to true
            if (oModel) {
              bHasUIChanges = oModel.hasPendingChanges();
            }
          }

          this._h.mainView.setProperty("/hasUIChanges", bHasUIChanges);
        },

        resetBindingChanges: function (oBinding) {
          oBinding.resetChanges();
          this.setError(false);
          this.setUIChanges(oBinding.getModel(), false);

          var aMessages = _.map(
            this.oMessageModelBinding.getContexts(),
            function (oContext) {
              return oContext.getObject();
            }
          );

          this.oMessageManager.removeMessages(aMessages);
        },

        resetModelChanges: function (oModel) {
          oModel.resetChanges();
          this.setError(false);
          this.setUIChanges(oModel, false);

          var aMessages = _.map(
            this.oMessageModelBinding.getContexts(),
            function (oContext) {
              return oContext.getObject();
            }
          );

          if (aMessages.length) {
            this.oMessageManager.removeMessages(aMessages);
          }
        },

        resetMessageManger: function () {
          var aMessages = _.map(
            this.oMessageModelBinding.getContexts(),
            function (oContext) {
              return oContext.getObject();
            }
          );

          if (aMessages.length) {
            this.oMessageManager.removeMessages(aMessages);
          }
        },

        setError: function (bError) {
          this._h.mainView.setProperty("/hasError", bError);
        },

        checkError: function () {
          return this._h.mainView.getProperty("/hasError");
        },

        checkUIChanges: function () {
          return this._h.mainView.getProperty("/hasUIChanges");
        },

        onMessageBindingChange: function (oEvent) {
          var aContexts = oEvent.getSource().getContexts();

          this.setError(false);

          if (!aContexts.length) {
            return;
          } else {
            var aErrorMessages = _.filter(aContexts, function (oContext) {
              return oContext.getObject().type === "Error";
            });

            if (aErrorMessages.length) {
              this.setUIChanges(null, true);
              this.setError(true);
              if (!this.sMessageType) {
                this.showMessageToast("msgError11");
              }
            } else {
              this.setUIChanges(null, false);
            }
          }
        },

        setMessageType: function (sType) {
          this.sMessageType = sType;

          this.oMessageManager.removeAllMessages();
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

        getDate: function (sDateTime) {
          if (sDateTime) {
            return moment(sDateTime).format("MM.DD.YYYY");
          } else {
            return "";
          }
        },

        getDeletedIfIcon: function (iStatus) {
          // switch (iStatus) {
          //   case 'true':
          //     return "sap-icon://delete";
          //   case 'false':
          //     return "sap-icon://complete";
          //   default:
          //     return "sap-icon://complete";
          // }

          switch (iStatus) {
            case "예":
            case true:
              return "sap-icon://delete";
            case false:
            case "아니오":
              return "sap-icon://complete";
            default:
              return "sap-icon://complete";
          }
        },

        getInterfaceStatusIcon: function (iStatus) {
          switch (iStatus) {
            case "사용":
              return "sap-icon://unlocked";
            case "미사용":
              return "sap-icon://locked";
            default:
              return "sap-icon://locked";
          }
        },

        getInterfaceStatusText: function (iStatus) {
          switch (iStatus) {
            case "사용":
              return "사용";
            case "미사용":
              return "미사용";
            default:
              return "미사용";
          }
        },

        getInterfaceBatchIcon: function (iStatus) {
          switch (iStatus) {
            case "Batch":
              return "sap-icon://fob-watch";
            case "Realtime":
              return "sap-icon://paper-plane";
            default:
              return "sap-icon://paper-plane";
          }
        },

        getInterfaceBatchText: function (iStatus) {
          switch (iStatus) {
            case "Batch":
              return "Batch";
            case "Realtime":
              return "Realtime";
            default:
              return "Realtime";
          }
        },

        getDeletedIfText: function (iStatus) {
          // switch (iStatus) {
          //   case 'true':
          //     return "Deleted";
          //   case 'false':
          //     return "Available";
          //   default:
          //     return "Available";
          // }

          switch (iStatus) {
            case "예":
              return "Deleted";
            case "아니오":
              return "Available";
            default:
              return "Available";
          }
        },

        getCertiText: function (iStatus) {
          switch (iStatus) {
            case "0":
              return "Basic";
            case "1":
              return "oAuth2.0";
          }
        },

        initMultiInput: function (self) {
          var fcvalidator = function (args) {
            var text = args.text;

            return new Token({ key: text, text: text });
          };

          self.getView().byId("MIInterfaceName").addValidator(fcvalidator);
          self.getView().byId("MIInterfaceNumber").addValidator(fcvalidator);
          self.getView().byId("MISSystemName").addValidator(fcvalidator);
          self.getView().byId("MISApplicationName").addValidator(fcvalidator);
          self.getView().byId("MITSystemName").addValidator(fcvalidator);
          self.getView().byId("MITApplicationName").addValidator(fcvalidator);
          self.getView().byId("MIInterfaceNumber").addValidator(fcvalidator);
          self.getView().byId("MIInterfaceNumber").addValidator(fcvalidator);
          self.getView().byId("MISCIIf").addValidator(fcvalidator);
          self.getView().byId("MISCIPackage").addValidator(fcvalidator);
          self.getView().byId("MiSystemAppNm").addValidator(fcvalidator);
          self.getView().byId("MCCDSoruceCd").addValidator(fcvalidator);
        },
        //------------------------- Common End -------------------------------------------

        //------------------------- Interface List  Start -------------------------------------------

        fcCancelEditInterfacePopup: function (oEvent) {
          this.closePopupFragment("UpdateInterface");
        },

        fcEditInterfaceList: function (oEvent) {
          var self = this;
          var oView = this.getView();

          // Select context
          var oContext = oEvent
            .getSource()
            .getParent()
            .getParent()
            .getBindingContext("management");


          // Create Popup
          if (!self.getControl('dialogRegisterInterfaceList')) {
            Fragment.load({
              id: oView.getId(),
              name: self._h.nameSpace + '.view.popup.UpdateInterface',
              controller: self
            }).then(function (oDialog) {
              oView.addDependent(oDialog);
              self.getControl('SFupdateInterface').setBindingContext(oContext, 'management');
              oDialog.open();
            });
          } else {
            self.getControl('SFupdateInterface').setBindingContext(oContext, 'management');
            self.getControl('dialogRegisterInterfaceList').open();
          }

          //this.callPopupFragment("UpdateInterface", oEvent);
        },

        fcInitInterfaceCreateData: function (oEvent) {
          var oMainverRegsiterData = this._h.mainView.getProperty(
            "/Interface/Regist/"
          );
          oMainverRegsiterData.StatusID = "";
          oMainverRegsiterData.Name = "";
          oMainverRegsiterData.Description = "";
          oMainverRegsiterData.Package = "";
          oMainverRegsiterData.IFName = "";
          oMainverRegsiterData.AsIsID = "";
          oMainverRegsiterData.AsIsName = "";
          oMainverRegsiterData.AsIsDescription = "";
          oMainverRegsiterData.SourceSystemID = "";
          oMainverRegsiterData.SourceSystemTypeID = "";
          oMainverRegsiterData.TargetSystemID = "";
          oMainverRegsiterData.TargetSystemDESC = "";
          oMainverRegsiterData.TargetSystemTypeID = "";
          oMainverRegsiterData.RFCName = "";
          oMainverRegsiterData.ESName = "";
          oMainverRegsiterData.WSName = "";
          oMainverRegsiterData.WSBName = "";
          oMainverRegsiterData.typeID = "";
          oMainverRegsiterData.Batch = [];

          var oMainverRegsiterData = this._h.mainView.setProperty(
            "/Interface/Regist/",
            oMainverRegsiterData
          );
        },

        fcCreateInterfacePopupElementDelete: function (oEvent) {
          var oSource = oEvent.getSource().getId();
          var Iindex = parseInt(
            oSource.substr(oSource.length - 1, oSource.length)
          );

          var oBatch = this._h.mainView.getProperty("/Interface/Regist/Batch");

          oBatch = _.pull(oBatch, oBatch[Iindex]);
          this._h.mainView.refresh();
        },

        fcshowBatchList: function (oEvent) {},

        fcChangeBatch: function (oEvent) {
          var sBatch = oEvent.getSource().getSelectedItem().getAdditionalText();
          var oTable = this.byId(this.ControlID.tabBatchList);

          switch (sBatch) {
            case "BATCH":
              oTable.setVisible(true);
              break;
            case "REALTIME":
              this.fcDeleteAllBatchList(oEvent);
              oTable.setVisible(false);
              break;
            default:
              break;
          }
        },

        fcChangeSystem: function (oEvent) {
          var sSourceSystem = this.byId(
            this.ControlID.ISourceSystem
          ).getValue();
          var sTargetSystem = this.byId(
            this.ControlID.ITargetSystem
          ).getValue();

          var oRFC = this.byId(this.ControlID.IRFC);
          var oES = this.byId(this.ControlID.IES);
          var oWS = this.byId(this.ControlID.IWS);
          var oWSB = this.byId(this.ControlID.IWSB);

          var sSourceSystemType = this.byId(
            this.ControlID.CSSType
          ).getSelectedItem();
          var sTargetSystemType = this.byId(
            this.ControlID.CTSType
          ).getSelectedItem();

          if (sSourceSystemType) {
            sSourceSystemType = sSourceSystemType.getText();
          } else {
            sSourceSystemType = "";
          }

          if (sTargetSystemType) {
            sTargetSystemType = sTargetSystemType.getText();
          } else {
            sTargetSystemType = "";
          }

          if (
            sSourceSystem.match("ERP") ||
            sSourceSystemType.match("RFC") ||
            sTargetSystem.match("ERP") ||
            sTargetSystemType.match("RFC")
          ) {
            oRFC.setEnabled(true);
            oES.setEnabled(true);
            oWS.setEnabled(true);
            oWSB.setEnabled(true);
          } else {
            oRFC.setEnabled(false);
            oES.setEnabled(false);
            oWS.setEnabled(false);
            oWSB.setEnabled(false);
          }
        },

        fcChangeCbcCycle: function (oEvent) {
          var sExec = oEvent.getSource().getSelectedItem().getAdditionalText();

          var sEventSorceID = oEvent.getSource().getId();
          var sViewID = this.getView().getId();
          var rRegex = new RegExp("-" + sViewID + "[a-zA-Z0-9-]+", "g");

          var oCbcInterval = sap.ui
            .getCore()
            .byId(
              sViewID +
              "--" +
              this.ControlID.CbcInterval +
              sEventSorceID.match(rRegex)[0]
            );

          var oTPToTime = sap.ui
            .getCore()
            .byId(
              sViewID +
              "--" +
              this.ControlID.TPToTime +
              sEventSorceID.match(rRegex)[0]
            );

          switch (sExec) {
            case "ONTIME":
              oTPToTime.setEnabled(false);
              oCbcInterval.setEnabled(false);
              break;
            case "EVERY":
              oTPToTime.setEnabled(true);
              oCbcInterval.setEnabled(true);
              break;
            default:
              break;
          }
        },

        fcChangeCbcExecType: function (oEvent) {
          var sExec = oEvent.getSource().getSelectedItem().getAdditionalText();

          var sEventSorceID = oEvent.getSource().getId();
          var sViewID = this.getView().getId();
          var rRegex = new RegExp("-" + sViewID + "[a-zA-Z0-9-]+", "g");

          var oCbcRecurrecn = sap.ui
            .getCore()
            .byId(
              sViewID +
              "--" +
              this.ControlID.CbcRecurrecn +
              sEventSorceID.match(rRegex)[0]
            );

          var oDPOnDate = sap.ui
            .getCore()
            .byId(
              sViewID +
              "--" +
              this.ControlID.DPOnDate +
              sEventSorceID.match(rRegex)[0]
            );

          switch (sExec) {
            case "DAY":
              oCbcRecurrecn.setEnabled(false);
              oDPOnDate.setEnabled(true);
              break;
            case "RECUR":
              oCbcRecurrecn.setEnabled(true);
              oDPOnDate.setEnabled(false);
              break;
            default:
              break;
          }
        },

        fcDeleteAllBatchList: function (oEvent) {
          var oList = this.byId(this.ControlID.tabBatchList);
          var oItems = oList
            .getBinding("items")
            .getModel()
            .setProperty("/Interface/Regist/Batch", []);
          this._h.mainView.refresh();
        },

        fcAddBatchList: function (oEvent) {
          var oList = this.byId(this.ControlID.tabBatchList);
          var oItems = oList
            .getBinding("items")
            .getModel()
            .getProperty("/Interface/Regist/Batch");
          oItems.push({
            EXECUTION_CD_ID: null,
            CYCLE_CD_ID: null,
            RECUR_CD_ID: null,
            ONDATE_D: null,
            TIMEINTERVAL_CD_ID: null,
            ONFRTIME_T: null,
            ONTOTIME_T: null,
            TIMEZONE: "",
          });
          this._h.mainView.refresh();
        },

        fcInterfaceRefresh: function (oEvent) {
          this.setBusy(this._h.mainView, true);
          this._h.management.refresh();
          this.setBusy(this._h.mainView, false);
          this.showMessageToast("msgSuccess14", "20rem", []);
        },

        fcCancelInterfacePopup: function (oEvent) {
          this.resetMessageManger();
          this.fcInitInterfaceCreateData();
          this.closePopupFragment("AddInterface");
        },

        fcCreateIntefaceList: function (oEvent) {
          this.fcInitInterfaceCreateData();
          this.callPopupFragment("AddInterface", oEvent);
        },

        fcSearchInterface: function (oEvent) {
          var self = this;
          var aFilters = [];

          var aInterfaceName = _.map(
            this.getControl(this.ControlID.MIInterfaceName).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aInterfaceNumber = _.map(
            this.getControl(this.ControlID.MIInterfaceNumber).getTokens(),
            (oData) => {
              return parseInt(oData.getKey());
            }
          );
          var aSSystemName = _.map(
            this.getControl(this.ControlID.MISSystemName).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aSApplicationName = _.map(
            this.getControl(this.ControlID.MISApplicationName).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aTSystemName = _.map(
            this.getControl(this.ControlID.MITSystemName).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aTApplicationName = _.map(
            this.getControl(this.ControlID.MITApplicationName).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aSCIPackage = _.map(
            this.getControl(this.ControlID.MISCIPackage).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );
          var aSCIIf = _.map(
            this.getControl(this.ControlID.MISCIIf).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );

          var aIFSorceCompanyCode = this.getControl(
            this.ControlID.MCIFSorceCompanyCode
          ).getSelectedKeys();
          var aIFSorceSubsidaryCode = this.getControl(
            this.ControlID.MCIFSorceSubsidaryCode
          ).getSelectedKeys();
          var aSApplicationType = this.getControl(
            this.ControlID.MCSApplicationType
          ).getSelectedKeys();
          var aSInterfaceProtocol = this.getControl(
            this.ControlID.MCSInterfaceProtocol
          ).getSelectedKeys();
          var aTargetCompanyCode = this.getControl(
            this.ControlID.MCTargetCompanyCode
          ).getSelectedKeys();
          var aTargetSubsidaryCode = this.getControl(
            this.ControlID.MCTargetSubsidaryCode
          ).getSelectedKeys();
          var aTApplicationType = this.getControl(
            this.ControlID.MCTApplicationType
          ).getSelectedKeys();
          var aTInterfaceProtocol = this.getControl(
            this.ControlID.MCTInterfaceProtocol
          ).getSelectedKeys();
          var aStatus = this.getControl(
            this.ControlID.MCstatus
          ).getSelectedKeys();
          var aInterfaceType = this.getControl(
            this.ControlID.MCInterfaceType
          ).getSelectedKeys();

          var bDeleted = this.getControl(
            this.ControlID.CBdeleted
          ).getSelected();

          var oTable = this.getControl(this.ControlID.tabInterfaceList);

          // Created Date Descending 초기화
          if (aInterfaceName.length > 0) {
            aFilters.push({
              field: "IF_NM",
              op: this.OP.CONTAINS,
              from: aInterfaceName,
            });
          }

          if (aInterfaceNumber.length > 0) {
            aFilters.push({
              field: "IF_NO",
              op: this.OP.EQ,
              from: aInterfaceNumber,
            });
          }
          if (aIFSorceCompanyCode.length > 0) {
            aFilters.push({
              field: "SC_SYS_COMAPANY_CODE",
              op: this.OP.EQ,
              from: aIFSorceCompanyCode,
            });
          }
          if (aIFSorceSubsidaryCode.length > 0) {
            aFilters.push({
              field: "SC_SYS_SUBSIDARY_CODE",
              op: this.OP.EQ,
              from: aIFSorceSubsidaryCode,
            });
          }
          if (aSSystemName.length > 0) {
            aFilters.push({
              field: "SC_SYS_NM",
              op: this.OP.EQ,
              from: aSSystemName,
            });
          }
          if (aSApplicationName.length > 0) {
            aFilters.push({
              field: "SC_SYS_APPL_NM",
              op: this.OP.EQ,
              from: aSApplicationName,
            });
          }
          if (aSApplicationType.length > 0) {
            aFilters.push({
              field: "SC_SYS_APPLTYPE_CODE",
              op: this.OP.EQ,
              from: aSApplicationType,
            });
          }
          if (aSInterfaceProtocol.length > 0) {
            aFilters.push({
              field: "SC_IFTYPE_CODE",
              op: this.OP.EQ,
              from: aSInterfaceProtocol,
            });
          }
          if (aTargetCompanyCode.length > 0) {
            aFilters.push({
              field: "TG_SYS_COMAPANY_CODE",
              op: this.OP.EQ,
              from: aTargetCompanyCode,
            });
          }
          if (aTargetSubsidaryCode.length > 0) {
            aFilters.push({
              field: "TG_SYS_SUBSIDARY_CODE",
              op: this.OP.EQ,
              from: aTargetSubsidaryCode,
            });
          }
          if (aTSystemName.length > 0) {
            aFilters.push({
              field: "TG_SYS_NM",
              op: this.OP.EQ,
              from: aTSystemName,
            });
          }
          if (aTApplicationName.length > 0) {
            aFilters.push({
              field: "TG_SYS_APPL_NM",
              op: this.OP.EQ,
              from: aTApplicationName,
            });
          }
          if (aTApplicationType.length > 0) {
            aFilters.push({
              field: "TG_SYS_APPLTYPE_CODE",
              op: this.OP.EQ,
              from: aTApplicationType,
            });
          }
          if (aTInterfaceProtocol.length > 0) {
            aFilters.push({
              field: "TG_IFTYPE_CODE",
              op: this.OP.EQ,
              from: aTInterfaceProtocol,
            });
          }
          if (aStatus.length > 0) {
            aFilters.push({
              field: "STATUS_CODE",
              op: this.OP.EQ,
              from: aStatus,
            });
          }
          if (aInterfaceType.length > 0) {
            aFilters.push({
              field: "EXECUTION_CODE",
              op: this.OP.EQ,
              from: aInterfaceType,
            });
          }
          if (aSCIPackage.length > 0) {
            aFilters.push({
              field: "PAKCAGE_NM",
              op: this.OP.EQ,
              from: aSCIPackage,
            });
          }
          if (aSCIIf.length > 0) {
            aFilters.push({
              field: "PI_NM",
              op: this.OP.CO,
              from: aSCIIf,
            });
          }
          if (!bDeleted) {
            aFilters.push({
              field: "DELETED_TF",
              op: this.OP.EQ,
              from: bDeleted,
            });
          }

          var aMultiFilter = this.makeMultiFilter(aFilters, true);

          oTable.getBinding("rows").filter(aMultiFilter);
          this.showMessageToast("msgSuccess14", "20rem", []);
        },

        ////// Value help
        // Source System
        onVHSSystemCancel: function (oEvent) {
          this.fragments["VHSSystemList"].close();
        },

        onVHSSystemAfterClose: function (oEvent) {
          this.fcChangeSystem(oEvent);
        },

        onVHSSystemOK: function (oEvent) {
          var oInput = this.byId(this.ControlID.ISourceSystem);

          var aTokens = oEvent.getParameter("tokens");
          oInput.setSelectedKey(aTokens[0].getKey());
          oInput.setValue(
            aTokens[0]
              .getText()
              .slice(
                0,
                aTokens[0].getText().length - aTokens[0].getKey().length - 3
              )
          );
          oInput.getValue();
          this.fragments["VHSSystemList"].close();
        },

        fcCreateInterfacePopup: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.ControlID.tabInterfaceList);
          var oInput = this._h.mainView.getProperty("/Interface/Regist");
          var sInputSSystem = this.byId(
            this.ControlID.ISourceSystem
          ).getSelectedKey();
          var sInputTSystem = this.byId(
            this.ControlID.ISourceSystem
          ).getSelectedKey();

          var oBinding = oTable.getBinding("rows");
          var oInputData = {
            IF_NM: oInput.Name,
            IF_DESC: oInput.Description,
            PAKCAGE_NM: oInput.Package,
            PI_NM: oInput.IFName,
            IF_ASIS: oInput.AsIsID,
            IF_ASIS_NM: oInput.AsIsName,
            IF_ASIS_DESC: oInput.AsIsDescription,
            STATUS_CD_ID: oInput.StatusID,
            SC_SYS_FK_ID: sInputSSystem,
            SC_IFTYPE_CD_ID: oInput.SourceSystemTypeID,
            TG_SYS_FK_ID: sInputTSystem,
            TG_IFTYPE_CD_ID: oInput.TargetSystemTypeID,
            RFC_NM: oInput.RFCName,
            ENTERPRSIESERVICE_NM: oInput.ESName,
            WEBSERVICE_NM: oInput.WSName,
            WEBBINDING_NM: oInput.WSBName,
            EXECUTION_CD_ID: oInput.typeID,
          };

          if (oInput.Batch.length > 1) {
            oInputData.BATCH = oInput.Batch;
          }

          oBinding.create(oInputData);

          this._h.management
            .submitBatch(this.ControlID.InterfaceDataGroup)
            .then(
              function (oData) {
                if (!oBinding.hasPendingChanges()) {
                  this.showMessageToast("msgSuccess13", "20rem", []);
                  this.closePopupFragment("AddInterface");
                } else {
                  this.setError(true);
                  this.showMessageToast("msgError019", "20rem");
                  oBinding.resetChanges();
                }
              }.bind(this)
            )
            .catch(
              function (oError) {
                this.setError(true);
                oBinding.resetChanges();
                this.showMessageToast("msgError04", "20rem", [oError.message]);
              }.bind(this)
            )
            .finally(() => {});
        },

        fcVHSSystem: function (oEvent) {
          var self = this;

          this.callPopupFragment("VHSSystemList");
          var oInput = this.byId(this.ControlID.ISourceSystem);
          // Column Settings

          var oColID = new sap.ui.table.Column({
            visible: false,
            label: new sap.m.Label({
              text: "{i18n>fldID}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>ID}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColCompany = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldCompanyCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>COMPANY_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColSubsidary = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSubsidaryCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>SUBSIDARY_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColSystem = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSystemNm}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>SYSTEM_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColApplication = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldApplNm}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>APPPLTYPE_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColApplType = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldApplTypeCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>APPPLTYPE_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "10rem",
          });

          var oColDescription = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSystemDescription}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>DESCRIPTION}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "10rem",
          });

          this.fragments["VHSSystemList"]
            .getTableAsync()
            .then(function (oTable) {
              // Model Setting to Table
              oTable.setModel(self.getModel("management"));

              // Rows Setting to Table
              if (oTable.bindRows) {
                oTable.bindAggregation("rows", {
                  path: "management>/SCI_VH_SYSTEMLIST_SRV",
                });
              }

              if (oTable.getColumns().length <= 0) {
                // Adding Column
                oTable.addColumn(oColID);
                oTable.addColumn(oColCompany);
                oTable.addColumn(oColSubsidary);
                oTable.addColumn(oColSystem);
                oTable.addColumn(oColApplication);
                oTable.addColumn(oColApplType);
                oTable.addColumn(oColDescription);
              }

              self.fragments["VHSSystemList"].update();
            });

          var oToken = new Token();
          oToken.setKey(oInput.getSelectedKey());
          oToken.setText(oInput.getValue());
          this.fragments["VHSSystemList"].setTokens([oToken]);
        },

        // Value Help - Target System
        onVHTSystemCancel: function (oEvent) {
          this.fragments["VHTSystemList"].close();
        },

        onVHTSystemAfterClose: function (oEvent) {
          this.fcChangeSystem(oEvent);
        },

        onVHTSystemOK: function (oEvent) {
          var oInput = this.byId(this.ControlID.ITargetSystem);

          var aTokens = oEvent.getParameter("tokens");
          oInput.setSelectedKey(aTokens[0].getKey());
          oInput.setValue(
            aTokens[0]
              .getText()
              .slice(
                0,
                aTokens[0].getText().length - aTokens[0].getKey().length - 3
              )
          );
          oInput.getValue();
          this.fragments["VHTSystemList"].close();
        },

        fcVHTSystem: function (oEvent) {
          var self = this;

          this.callPopupFragment("VHTSystemList");
          var oInput = this.byId(this.ControlID.ITargetSystem);
          // Column Settings

          var oColID = new sap.ui.table.Column({
            visible: false,
            label: new sap.m.Label({
              text: "{i18n>fldID}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>ID}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColCompany = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldCompanyCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>COMPANY_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColSubsidary = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSubsidaryCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>SUBSIDARY_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColSystem = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSystemNm}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>SYSTEM_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "100px",
          });

          var oColApplication = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldApplNm}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>APPL_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "10rem",
          });

          var oColApplType = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldApplTypeCd}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>APPPLTYPE_NM}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "10rem",
          });

          var oColDescription = new sap.ui.table.Column({
            label: new sap.m.Label({
              text: "{i18n>fldSystemDescription}",
              textAlign: "Center",
              width: "100%",
            }),
            template: new sap.m.Text({
              text: "{management>DESCRIPTION}",
              textAlign: "Center",
              width: "100%",
              wrapping: false,
            }),
            width: "10rem",
          });

          this.fragments["VHTSystemList"]
            .getTableAsync()
            .then(function (oTable) {
              // Model Setting to Table
              oTable.setModel(self.getModel("management"));

              // Rows Setting to Table
              if (oTable.bindRows) {
                oTable.bindAggregation("rows", {
                  path: "management>/SCI_VH_SYSTEMLIST_SRV",
                });
              }

              if (oTable.getColumns().length <= 0) {
                // Adding Column
                oTable.addColumn(oColID);
                oTable.addColumn(oColCompany);
                oTable.addColumn(oColSubsidary);
                oTable.addColumn(oColSystem);
                oTable.addColumn(oColApplication);
                oTable.addColumn(oColApplType);
                oTable.addColumn(oColDescription);
              }

              self.fragments["VHTSystemList"].update();
            });

          var oToken = new Token();
          oToken.setKey(oInput.getSelectedKey());
          oToken.setText(oInput.getValue());

          this.fragments["VHTSystemList"].setTokens([oToken]);
        },

        //------------------------- Interface List  End -------------------------------------------

        //------------------------- Code List Start -------------------------------------------

        // 코드 리스트 새로고침
        fcCodeRefresh: function (oEvent) {
          this.setUIChanges(this._h.management);

          if (this.checkUIChanges()) {
            this.showMessageToast("msgWarn02", "20rem", []);
            return;
          }

          this.setMessageType(this.MESSAGE_TYPE.REFRESH);
          this.getControl(this.ControlID.tabCodeList)
            .getBinding("rows")
            .refresh();
        },

        // 코드 리스트 검색
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
          var oControl = this.getControl(this.ControlID.tabCodeList);
          var oSCCat01 = this.getControl(this.ControlID.MCCDSoruceCt01);
          var oSCCat02 = this.getControl(this.ControlID.MCCDSoruceCt02);
          var oSCCat03 = this.getControl(this.ControlID.MCCDSoruceCt03);

          // 선택 데이터 가져오기
          var oSCCategory01 = oSCCat01.getSelectedKeys();
          var oSCCategory02 = oSCCat02.getSelectedKeys();
          var oSCCategory03 = oSCCat03.getSelectedKeys();

          var oDeleted = this.getControl(
            this.ControlID.SLCodedeleted
          ).getSelected();

          // 명칭 데이터 가져오기 ( Tokens 임포트 필요)
          var oApplCdTokens = _.map(
            this.getView().byId("MCCDSoruceCd").getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );

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

          if (!oDeleted) {
            aCodeNameFilters.push({
              field: "DELETED_TF",
              op: this.OP.EQ,
              from: oDeleted,
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

        // 코드 생성 팝업 나타내기
        fcCreateCode: function (oEvent) {
          this._h.mainView.setProperty("/CodeList/Add", {
            cat01: "",
            cat02: "",
            cat03: "",
            codeNm: "",
            description: "",
            detailDescription: "",
          });


          this.callPopupFragment("AddCodeList", oEvent);
        },

        // 코드 생성 확정
        fcConfirmAddCodePopup: function (oEvent) {
          var self = this;
          // 테이블 컨트롤러 호출
          var oTable = this.getControl(this.ControlID.tabCodeList);
          this.oMessageManager.removeAllMessages();

          var bError = false;
          var oInput = this._h.mainView.getProperty("/CodeList/Add");

          if (!oInput.cat01) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [this.getI18nText("fldCodeSection")]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.cat02) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [this.getI18nText("fldCodeDetailSection")]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.codeNm) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [this.getI18nText("fldCodeName")]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (bError) {
            this.showMessageToast("msgError11", "20rem", []);
            return;
          }

          var oBinding = oTable.getBinding("rows");

          oBinding.create({
            CAT01: oInput.cat01,
            CAT02: oInput.cat02,
            CAT03: oInput.cat03,
            CODE: oInput.codeNm,
            DESC01: oInput.description,
            DESC02: oInput.detailDescription,
          });

          this.setMessageType(this.MESSAGE_TYPE.CREATE);

          this._h.management.submitBatch(this.ControlID.codeListDataGroup).then(
            function (oData) {
              this.showMessageToast("msgSuccess13", "20rem", []);
              this.closePopupFragment(this.ControlID.AddCodeList);
              // this._h.management.refresh();
            }.bind(this),
            function (oError) {
              this.resetBindingChanges(oBinding);
              this.showMessageToast("msgError04", "20rem", [oError.message]);
            }.bind(this)
          );
        },

        // 코드 생성 팝업 닫기
        fcCancelAddCodePopup: function (oEvent) {
          this.oMessageManager.removeAllMessages();
          this.closePopupFragment("AddCodeList");
        },

        // 코드 수정 팝업 나타내기
        fcUpdateCodeList: function (oEvent) {

          this.callPopupFragment(this.ControlID.UpdateCodeList, oEvent);

          var oPath = this.getListItemContext(oEvent, "management").sPath;
          var oD = this.getListItemContext(oEvent, "management");
          console.log(oD);

          this.fragments["UpdateCodeList"].bindElement({
            path: oPath,
            model: "management",
          });
        },

        // 코드 수정 확정
        fcConfirmUpdateCodePopup: function (oEvent) {
          var self = this;
          this.setUIChanges(this._h.management);

          console.log(this.checkUIChanges());

          if (this.checkUIChanges()) {
            this._h.management
              .submitBatch(this.ControlID.codeListDataGroup)
              .then(
                function () {
                  self.setUIChanges(self._h.management, false);
                  self.setMessageType(self.MESSAGE_TYPE.UPDATE);
                  self.getControl("dialogUpdateCodeList").close();
                  self._h.management.refresh();
                },
                function (oError) {
                  self.setUIChanges(self._h.management, false);
                  self.showMessageToast("msgError10", "20rem", [
                    oError.message,
                  ]);
                }
              );
          } else {
            this.getControl("dialogUpdateCodeList").close();
            this.showMessageToast("msgInfo01", "20rem");
            this._h.management.refresh();
          }
        },

        // 코드 수정 팝업 닫기
        fcCancelUpdateCodePopup: function (oEvent) {
          this.oMessageManager.removeAllMessages();
          this.closePopupFragment("UpdateCodeList");
        },

        // 코드 선택
        fcSelectionChangeCodeList: function (oEvent) {
          this._h.mainView.setProperty(
            "/CodeList/selectedCount",
            oEvent.getSource().getSelectedIndices().length
          );
        },

        // 코드 삭제
        fcDeleteCodeList: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.ControlID.tabCodeList);
          var oBinding = oTable.getBinding("rows");

          if (!this._h.mainView.getProperty("/CodeList/selectedCount")) {
            this.showMessage(
              this.MSGTYPE.WARNING,
              "Error",
              this.getI18nText("tlDeleteSetting")
            );
            return;
          }

          this.callPopupConfirm("msgAlert002", "alert", this.MSGBOXICON.WARNING)
            .then(function (sAction) {
              if (sAction === "OK") {
                _.forEach(oTable.getSelectedIndices(), function (iIndex) {
                  oTable
                    .getContextByIndex(iIndex)
                    .setProperty("DELETED_TF", true);
                });

                self.setMessageType(self.MESSAGE_TYPE.UPDATE);

                self._h.management.submitBatch("codeListDataGroup").then(
                  // Success
                  function (oData) {
                    self._h.management.refresh();
                    oTable.clearSelection();
                    self.showMessageToast("msgSuccess040", "20rem", []);
                  },
                  // Fail
                  function (oError) {
                    self.resetBindingChanges(oBinding);
                    self.showMessageToast("msgError10", "20rem", [
                      oError.message,
                    ]);
                  }
                );
              }
            })
            .catch(function (oError) {
              console.log(oError);
            });
        },


        //------------------------- Code List End -------------------------------------------

        //------------------------- System List Start -------------------------------------------
        fcRefreshSystemList: function (oEvent) {
          this.setUIChanges(this._h.management);

          if (this.checkUIChanges()) {
            this.showMessageToast("msgWarn02", "20rem", []);
            return;
          }

          this.setMessageType(this.MESSAGE_TYPE.REFRESH);
          this.getControl(this.ControlID.tabSystemList)
            .getBinding("rows")
            .refresh();
        },

        fcSelectionChangeSystemList: function (oEvent) {
          this._h.mainView.setProperty(
            "/SystemList/selectedCount",
            oEvent.getSource().getSelectedIndices().length
          );
        },

        //Search
        fcSearchSystemList: function (oEvent) {
          var self = this;
          var aFilters = [];
          var aCompanyFilters = [];
          var aSubsidaryFilters = [];
          var oCompanyFilter = null;
          var oSubsidaryFilter = null;
          var oControl = this.getControl(this.ControlID.tabSystemList);
          var oSCCompany = this.getControl(this.ControlID.McSLSorceCompanyCd);
          var oSCSubsidary = this.getControl(
            this.ControlID.McSLSorceSubsidiaryCd
          );
          var oApplNmTokens = _.map(
            this.getView().byId(this.ControlID.MiSystemAppNm).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );

          var oSCCompany = oSCCompany.getSelectedKeys();
          var oSCSubsidary = oSCSubsidary.getSelectedKeys();

          var oDeleted = this.getControl(
            this.ControlID.SLCbdeleted
          ).getSelected();

          //회사
          if (oSCCompany.length) {
            aCompanyFilters = _.map(oSCCompany, function (iStatus) {
              return {
                field: "COMPANY_CODE",
                op: self.OP.EQ,
                from: iStatus,
              };
            });

            oCompanyFilter = this.makeMultiFilter(aCompanyFilters, false);
          }

          //자회사
          if (oSCSubsidary.length) {
            aSubsidaryFilters = _.map(oSCSubsidary, function (iStatus) {
              return {
                field: "SUBSIDARY_CODE",
                op: self.OP.EQ,
                from: iStatus,
              };
            });

            oSubsidaryFilter = this.makeMultiFilter(aSubsidaryFilters, false);
          }

          //어플리케이션 명
          if (oApplNmTokens.length > 0) {
            aFilters.push({
              field: "APPL_NM",
              op: this.OP.CONTAINS,
              from: oApplNmTokens,
            });
          }

          if (!oDeleted) {
            aFilters.push({
              field: "DELETED_TF",
              op: this.OP.EQ,
              from: oDeleted,
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

        //manager popup open
        fcManagerPopUp: function (oEvent) {
          this.callPopupFragment(this.ControlID.SystemListManager, oEvent);
          var managerList = this.getListItemContext(oEvent, "management");
          var oPath = this.getListItemContext(oEvent, "management").sPath;
          // var managerList = oEvent.getSource().getBindingContext("MANAGER")

          console.log(managerList);
        },

        //manager popup close
        fcCloseSystemListManagerPopUp: function (oEvent) {
          this.closePopupFragment(this.ControlID.SystemListManager, oEvent);
        },

        //Create
        fcCreateSystemList: function (oEvent) {
          this._h.mainView.setProperty("/SystemList/Add", {
            appliNm: "",
            systemNm: "",
            description: "",
            Manager: [],
            systemIP: "",
            systemHost: "",
            systemPort: "",
            systemCerti: "0",
          });

          this.callPopupFragment("AddSystemList", oEvent);
        },

        //manager Tb add btn
        fcAddManager: function (oEvent) {
          var oList = this.byId(this.ControlID.tabAddMangerList);
          var oItems = oList
            .getBinding("items")
            .getModel()
            .getProperty("/SystemList/Add/Manager");
          oItems.push({
            NAME: "",
            PHONE: "",
            EMAIL: "",
          });
          this._h.management.refresh();
        },

        //manager Tb delete btn
        fcDeleteManager: function (oEvent) {
          var oSource = oEvent.getSource().getId();
          var Iindex = parseInt(
            oSource.substr(oSource.length - 1, oSource.length)
          );

          var oManager = this._h.mainView.getProperty(
            "/SystemList/Add/Manager"
          );

          oManager = _.pull(oManager, oManager[Iindex]);
          this._h.mainView.refresh();
        },

        fcAddSystemListPopup: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.ControlID.tabSystemList);
          this.oMessageManager.removeAllMessages();

          // Check Input
          var bError = false;
          var oInput = this._h.mainView.getProperty("/SystemList/Add");

          if (!oInput.company) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldCompanyCd"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.subdiary) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldSubsidaryCd"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.appliCd) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldApplTypeCd"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.appliNm) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldApplNm"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.systemNm) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldSystemNm"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.description) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", [
                this.getI18nText("fldSystemDescription"),
              ]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (bError) {
            this.showMessageToast("msgError11", "20rem", []);
            return;
          }

          var oBinding = oTable.getBinding("rows");

          oBinding.create({
            COMPANY_CD_ID: oInput.company,
            SUBSIDARY_CD_ID: oInput.subdiary,
            APPPLTYPE_CD_ID: oInput.appliCd,
            APPL_NM: oInput.appliNm,
            SYSTEM_NM: oInput.systemNm,
            DESCRIPTION: oInput.description,
            MANAGER: oInput.Manager,
            IP: oInput.systemIP,
            HOST: oInput.systemHost,
            PORT: oInput.systemPort,
            ATHENTIC_TYPE: _.toInteger(oInput.systemCerti),
          });

          this.setMessageType(this.MESSAGE_TYPE.CREATE);

          this._h.management
            .submitBatch(self.ControlID.systemListDataGroup)
            .then(
              function (oData) {
                this.showMessageToast("msgSuccess13", "20rem", []);
                this.getControl(
                  this.ControlID.AddSysLiCompanyCd
                ).setSelectedKey("");
                this.getControl(
                  this.ControlID.AddSysLiSubdiaryCd
                ).setSelectedKey("");
                this.closePopupFragment(self.ControlID.AddSystemList);
              }.bind(this),
              function (oError) {
                this.resetBindingChanges(oBinding);
                this.showMessageToast("msgError04", "20rem", [oError.message]);
              }.bind(this)
            );
        },

        fcCancelAddSystemListPopUp: function (oEvent) {
          this.getControl(this.ControlID.AddSysLiCompanyCd).setSelectedKey("");
          this.getControl(this.ControlID.AddSysLiSubdiaryCd).setSelectedKey("");
          this.getControl(this.ControlID.AddSysLiAppliCd).setSelectedKey("");

          this.closePopupFragment(this.ControlID.AddSystemList, oEvent);
        },

        //Update
        fcUpdateSystemList: function (oEvent) {
          this.callPopupFragment(this.ControlID.UpdateSystemList, oEvent);

          var oPath = this.getListItemContext(oEvent, "management").sPath;

          this.fragments["UpdateSystemList"].bindElement({
            path: oPath,
            model: "management",
          });
        },

        //manager update(add)
        fcUpdateManager: function (oEvent) {
          var oList = this.byId(this.ControlID.tabUpdateMangerList);
          var oItems = oList
            .getBinding("items")
            .getModel()
            .getProperty("/SystemList/Update/Manager");
          oItems.push({
            NAME: "",
            PHONE: "",
            EMAIL: "",
          });
          this._h.management.refresh();
        },

        fcDeleteManagerUpdate: function (oEvent) {
          var oSource = oEvent.getSource().getId();
          var Iindex = parseInt(
            oSource.substr(oSource.length - 1, oSource.length)
          );

          var oManager = this._h.mainView.getProperty(
            "/SystemList/Update/Manager"
          );

          oManager = _.pull(oManager, oManager[Iindex]);
          this._h.mainView.refresh();
        },

        fcUpdateSystemListPopup: function (oEvent) {
          var self = this;
          this.setUIChanges(this._h.management);

          if (this.checkUIChanges()) {
            this._h.management
              .submitBatch(this.ControlID.systemListDataGroup)
              .then(
                //success
                function () {
                  console.log("success inin");
                  self.setUIChanges(self._h.management, false);
                  self.setMessageType(self.MESSAGE_TYPE.UPDATE);
                  self.closePopupFragment(self.ControlID.UpdateSystemList);
                  self._h.management.refresh();
                },
                //fail
                function (oError) {
                  console.log("fail inin");
                  self.setUIChanges(self._h.management, false);
                  self.showMessageToast("msgError10", "20rem", [
                    oError.message,
                  ]);
                }
              );
          } else {
            console.log("else inin");
            this.closePopupFragment(this.ControlID.UpdateSystemList);
            this.showMessageToast("msgInfo01", "20rem");
          }
        },

        fcCancelUpdateSystemListPopUp: function (oEvent) {
          this.resetBindingChanges(
            this.getControl(this.ControlID.formUpdateSystemList)
              .getBindingContext("management")
              .getBinding()
          );

          if (this._h.management.hasPendingChanges()) {
            this.getControl(this.ControlID.formUpdateSystemList)
              .getBindingContext("management")
              .getBinding()
              .refresh();
          }
          this.closePopupFragment(this.ControlID.UpdateSystemList, oEvent);
        },

        //Delete
        fcDeleteSystemList: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.ControlID.tabSystemList);
          var oBinding = oTable.getBinding("rows");

          if (oTable.getSelectedIndices().length === 0) {
            this.showMessageToast("msgWarn03", "20rem", []);
            return;
          }

          this.callPopupConfirm("msgAlert03", "alert", this.MSGBOXICON.WARNING)
            .then(function (sAction) {
              if (sAction === "OK") {
                //table index
                _.forEach(oTable.getSelectedIndices(), function (iIndex) {
                  oTable
                    .getContextByIndex(iIndex)
                    .setProperty("DELETED_TF", true);
                });

                //batch
                self._h.management
                  .submitBatch(self.ControlID.systemListDataGroup)
                  .then(
                    // Success
                    function (oData) {
                      self._h.management.refresh();
                      oBinding.refresh();
                      oTable.clearSelection();
                    }, // Fail
                    function (oError) {
                      self.resetBindingChanges(oBinding);
                      self.showMessageToast("msgError10", "20rem", [oError]);
                    }
                  )
                  .catch(
                    // Fail
                    function (oError) {
                      self.resetBindingChanges(oBinding);
                      self.showMessageToast("msgError10", "20rem", [oError]);
                    }
                  );
              }
            })
            .catch(function (oError) {
              console.log(oError);
            });
        },
        //------------------------- System List End -------------------------------------------
      }
    );
  }
);
