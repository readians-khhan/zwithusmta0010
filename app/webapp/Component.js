sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"withus/sci/management/SCIManagement/model/models",
	"withus/sci/management/SCIManagement/DataHub",
	'sap/ui/model/json/JSONModel'
], function (UIComponent, Device, models, DataHub, JSONModel) {
	"use strict";

	return UIComponent.extend("withus.sci.management.SCIManagement.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this._h = new DataHub();
			this._h.manifest = this.getManifest();
			this._h.device = this.makeDeviceModel();
			this._h.i18n = this.getModel('i18n');

			// 컴포넌트모델 설정
			this.setModel(this._h.device, 'device');

			// 라우터초기화
			this.getRouter()
				.getTargetHandler()
				.setCloseDialogs(false);
			this.getRouter().initialize();
			this._h.router = this.getRouter();

			this._h.management = this.getModel('management');
			this._h.management.getMetaModel().fetchData();
		},
		getContentDensityClass: function () {

			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!this._h.device.getProperty('/').support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}

			return this._sContentDensityClass;
		},
		makeDeviceModel: function () {
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			return oDeviceModel;
		}
	});
});