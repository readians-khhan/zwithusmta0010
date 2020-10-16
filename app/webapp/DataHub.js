sap.ui.define([
  'sap/ui/base/Object',
  'sap/ui/model/json/JSONModel'
], function (Object) {
  'use strict';

  return Object.extend('withus.sci.management.SCIManagement.model.common.DataHub', {
    /**
     * 공통변수
     * manifest : manifest 설정정보
     * device : device 모델
     * i18n : i18n 리소스 번들
     */
    manifest: null,
    device: null,
    i18n: null,
    router: null,
    nameSpace: 'withus.sci.management.SCIManagement',

    /**
     * 초기 설정 값
     */
    mainViewInitData: {
      busy: false,
      search: '',
      bpSearch: '',
      condition: {
        iconKey: 'T',
        fromDate: null,
        toDate: null
      },
      action: '',
    
      hasUIChanges: false,
      hasError: false,
      stickyOptions: ['HeaderToolbar', 'ColumnHeaders'],
      statusCount: {
        total: 0,
        draft: 0,
        request: 0,
        reject: 0,
        approval: 0,
        cancel: 0
      },


      Files: {
				condition: {
					fromDate: null,
					toDate: null,
					fileName: '',
					fileStatus: ['0'],
					movementStatus: ['0', '1', '2', '3', '4', '5', '6'],
					confirmationStatus: ['0', '1', '2', '3', '4', '5', '6'],
					postingfromDate: null,
					postingtoDate: null
				},
				statusFile: [{
					statusKey: '0',
					statusName: "Active"
				}, {
					statusKey: '1',
					statusName: "Deleted"
				}],
				statusList: [{
					statusKey: '0',
					statusName: "Not Target"
				}, {
					statusKey: '1',
					statusName: "Not Executed"
				}],
				totalCount: 0,
				selectedCount: 0,
				activeDelete: false
      },
      Codes: {
				FieldName: '',
				FieldStatus: [{
					FieldStatusKey: "Movement",
					FieldStatusName: "Movements"
				}, {
					FieldStatusKey: "Confirmation",
					FieldStatusName: "Confirmations"
				}],
				SelectedFieldStatusKey: "Confirmation",
				totalModificationsCount: 0,
				selectedModificationsCount: 0
			},
      System: {
				condition: {
					fromDate: null,
					toDate: null,
					fileName: '',
					fileStatus: ['0'],
					movementStatus: ['0', '1', '2', '3', '4', '5', '6'],
					confirmationStatus: ['0', '1', '2', '3', '4', '5', '6'],
					postingfromDate: null,
					postingtoDate: null
				},
				statusFile: [{
					statusKey: '0',
					statusName: "Active"
				}, {
					statusKey: '1',
					statusName: "Deleted"
				}],
				statusList: [{
					statusKey: '0',
					statusName: "Not Target"
				}, {
					statusKey: '1',
					statusName: "Not Executed"
				}],
				totalCount: 0,
				selectedCount: 0,
				activeDelete: false
			},
     
      SAPURL: '',
      ApiLog: ''
    },

    bpWorkflowURL: '/backend/bpworkflow/BPWorkflows_SRV'
  });
});