sap.ui.define(
  [
    "sap/m/MessageToast",
    "withus/sci/management/SCIManagement/controller/common/BaseController",
    "sap/ui/core/message/Message",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
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
    FilterType,
    screenData,
    Token
  ) {
    "use strict";

    return BaseController.extend(
      "withus.sci.management.SCIManagement/controller.Main",
      {
        CONTROL_ID: {
          // System List
          tabSystemList: "tabSystemList",
          tabSystemList__bDelete: "tabSystemList__bDelete",
          systemListDataGroup: "systemListDataGroup",
          McSLSorceCompanyCd: "McSLSorceCompanyCd",
          McSLSorceSubsidiaryCd: "McSLSorceSubsidiaryCd",
          MiSystemAppNm: "MiSystemAppNm",
          //--- Add Pop Up ---
          AddSystemList: "AddSystemList",
          AddSysLiCompanyCd: "AddSysLiCompanyCd",
          AddSysLiSubdiaryCd: "AddSysLiSubdiaryCd",
          AddSysLiAppliCd: "AddSysLiAppliCd",

          //--- Update Pop Up ---
          UpdateSystemList: "UpdateSystemList",
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
          this.getRouter()
            .getRoute("main")
            .attachPatternMatched(this.onPatternMatched, this);

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

          // View Data Initialization
          this.sMessageType = "";

          this.initMultiInput(this);
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
            //---- Delete ----
            case "fcDeleteSystemList":
              this.fcDeleteSystemList(oEvent);
              break;
          }
        },

        /* ========================================================== */
        /* Local Methods
		/* ========================================================== */
        initMultiInput: function (self) {
          var fcvalidator = function (args) {
            var text = args.text;

            return new Token({ key: text, text: text });
          };

          //System List
          self
            .getView()
            .byId(this.CONTROL_ID.MiSystemAppNm)
            .addValidator(fcvalidator);
        },

        initSystemListView: function () {},

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
              this.getView()
                .byId(this.CONTROL_ID.tabSystemList__bDelete)
                .setEnabled(false);
              oNavConMain.to(this.getControl("dp-system"), "slide");
              break;
            case "exception":
              oNavConMain.to(this.getControl("dp-exception"), "slide");
              break;
          }
        },

        fcSearchInterface: function (oEvent) {},

        //System List
        fcRefreshSystemList: function (oEvent) {
          this.setUIChanges(this._h.management);

          if (this.checkUIChanges()) {
            this.showMessageToast("msgWarn02", "20rem", []);
            return;
          }

          this.setMessageType(this.MESSAGE_TYPE.REFRESH);
          this.getControl(this.CONTROL_ID.tabSystemList)
            .getBinding("rows")
            .refresh();
        },

        fcSearchSystemList: function (oEvent) {
          var self = this;
          var aFilters = [];
          var aCompanyFilters = [];
          var aSubsidaryFilters = [];
          var oCompanyFilter = null;
          var oSubsidaryFilter = null;
          var oControl = this.getControl(this.CONTROL_ID.tabSystemList);
          var oSCCompany = this.getControl(this.CONTROL_ID.McSLSorceCompanyCd);
          var oSCSubsidary = this.getControl(
            this.CONTROL_ID.McSLSorceSubsidiaryCd
          );
          var oApplNmTokens = _.map(
            this.getView().byId(this.CONTROL_ID.MiSystemAppNm).getTokens(),
            (oData) => {
              return oData.getKey();
            }
          );

          var oSCCompany = oSCCompany.getSelectedKeys();
          var oSCSubsidary = oSCSubsidary.getSelectedKeys();

          //회사
          if (oSCCompany.length) {
            aCompanyFilters = _.map(oSCCompany, function (iStatus) {
              return {
                field: "COMAPANY_CODE",
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

        fcCreateSystemList: function (oEvent) {
          this._h.mainView.setProperty("/SystemList/Add", {
            appliNm: "",
            systemNm: "",
          });

          this.callPopupFragment("AddSystemList", oEvent);
        },

        onChange: function (oEvent) {
          var sId = oEvent.getSource().sId;

          console.log(sId);
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
          }
        },

        fcAddSystemListPopup: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.CONTROL_ID.tabSystemList);
          this.oMessageManager.removeAllMessages();

          // Check Input
          var bError = false;
          var oInput = this._h.mainView.getProperty("/SystemList/Add");

          console.log(oInput);

          if (!oInput.company) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", ["Company"]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.subdiary) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", ["Subdiary Company"]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.appliCd) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", ["Application Code"]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.appliNm) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", ["Application Name"]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (!oInput.systemNm) {
            bError = true;
            var oMessage = new Message({
              message: this.getI18nText("msgError09", ["System Name"]),
              type: "Error",
              processor: this._h.mainView,
            });
            this.oMessageManager.addMessages(oMessage);
          }

          if (bError) {
            return;
          }

          var oBinding = oTable.getBinding("rows");

          oBinding.create({
            COMAPANY_CODE: oInput.company,
            SUBSIDARY_CODE: oInput.subdiary,
            APPLTYPE_CODE: oInput.appliCd,
            APPL_NM: oInput.appliNm,
            SYSTEM_NM: oInput.systemNm,
            // description: oInput.description,
            // managerName: oInput.managerName,
            // contact: oInput.contact,
            // email: oInput.email,
            // systemIP: oInput.systemIP,
            // systemHost: oInput.systemHost,
            // systemPort: oInput.systemPort,
            // systemCerti: oInput.systemCerti
          });

          this.setMessageType(this.MESSAGE_TYPE.CREATE);

          this._h.management
            .submitBatch(this.CONTROL_ID.systemListDataGroup)
            .then(
              function (oData) {
                this.showMessageToast("msgSuccess13", "20rem", []);
                this.closePopupFragment(this.CONTROL_ID.AddSystemList);
              }.bind(this),
              function (oError) {
                this.resetBindingChanges(oBinding);
                this.showMessageToast("msgError04", "20rem", [oError.message]);
              }.bind(this)
            );
        },

        fcCancelAddSystemListPopUp: function (oEvent) {
          this.closePopupFragment(this.CONTROL_ID.AddSystemList, oEvent);
        },

        fcUpdateSystemList: function (oEvent) {
          this.callPopupFragment(this.CONTROL_ID.UpdateSystemList, oEvent);

          var oData = this.getListItemContext(oEvent, "management").oData;
          var oPath = this.getListItemContext(oEvent, "management").sPath;

          console.log(oData);

          this.fragments["UpdateSystemList"].bindElement({
            path: oPath,
            model: "management",
          });
        },

        fcUpdateSystemListPopup: function (oEvent) {
          var self = this;

          this.setUIChanges(this._h.management);

          if (this.checkUIChanges()) {
            this._h.management
              .submitBatch(this.CONTROL_ID.systemListDataGroup)
              .then(
                function (oSuccess) {
                  console.log(oSuccess);
                  self.setUIChanges(self._h.management, false);
                  self.setMessageType(self.MESSAGE_TYPE.UPDATE);
                  self.closePopupFragment(this.CONTROL_ID.UpdateSystemList);
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
            this.closePopupFragment(this.CONTROL_ID.UpdateSystemList);
            this.showMessageToast("msgInfo01", "20rem");
          }
        },

        fcCancelUpdateSystemListPopUp: function (oEvent) {
          this.closePopupFragment(this.CONTROL_ID.UpdateSystemList, oEvent);
        },

        //Single Selection
        fcDeleteSystemList: function (oEvent) {
          var self = this;
          var oTable = this.getControl(this.CONTROL_ID.tabSystemList);
          var oBinding = oTable.getBinding("rows");

          if (oTable.getSelectedIndices().length === 0) {
            self.showMessageToast("msgWarn03", "20rem", []);
            return;
          }

          this.callPopupConfirm("msgAlert03", "alert", this.MSGBOXICON.WARNING)
            .then(function (sAction) {
              if (sAction === "OK") {
                _.forEach(oTable.getSelectedIndices(), function (iIndex) {
                  oTable
                    .getContextByIndex(iIndex)
                    .setProperty("isDeleted", true);
                });

                self.setMessageType(self.MESSAGE_TYPE.UPDATE);

                self._h.mesData
                  .submitBatch(this.CONTROL_ID.systemListDataGroup)
                  .then(
                    // Success
                    function (oData) {
                      self._h.mesData.refresh();
                      oTable.clearSelection();
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

        //Multi Toggle
        // fcDeleteSystemList: function (oEvent) {
        // 	var self = this;
        // 	var oTable = this.getControl(this.CONTROL_ID.tabSystemList);

        // 	if (!this._h.mainView.getProperty('/SystemList/selectedCount')) {
        // 		this.showMessage(this.MSGTYPE.ERROR, 'Error', this.getI18nText('msgWarn01'));
        // 		return;
        // 	}

        // 	this.callPopupConfirm('msgAlert01', 'alert', this.MSGBOXICON.WARNING)
        // 		.then(function (sAction) {
        // 			var aPromises = [];

        // 			if (sAction === 'OK') {
        // 				_.map(oTable.getSelectedIndices(), function (iIndex) {
        // 					aPromises.push(oTable.getBinding('rows').getContexts()[iIndex].delete('$auto'));
        // 				});

        // 				Promise.all(aPromises)
        // 					.then(function (aResult) {
        // 						self.showMessageToast('msgSuccess03', '20rem', []);
        // 						self._h.mainView.setProperty('/SystemList/selectedCount', oTable.getBinding('rows').getLength());
        // 					})
        // 					.catch(function (sError) {
        // 						self.showMessageToast('msgError01', '20rem', []);
        // 					})
        // 					.finally(function () {
        // 						oTable.clearSelection();
        // 						oTable.getBinding('rows').refresh();
        // 					});
        // 			}
        // 		})
        // 		.catch((function (oError) {
        // 			console.log(oError);
        // 		}));
        // },

        getDate: function (sDateTime) {
          if (sDateTime) {
            return moment(sDateTime).format("MM.DD.YYYY");
          } else {
            return "";
          }
        },

        getDeletedIfIcon: function (iStatus) {
          switch (iStatus) {
            case "true":
              return "sap-icon://delete";
            case "false":
              return "sap-icon://complete";
            default:
              return "sap-icon://complete";
          }
        },

        getDeletedIfText: function (iStatus) {
          switch (iStatus) {
            case "true":
              return "Deleted";
            case "false":
              return "Available";
            default:
              return "Available";
          }
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
      }
    );
  }
);
