using {
  SCIManagementService as Service,
  SCIManagementService.SCI_MST_CODE_SRV as MST_CODE,
  SCIManagementService.SCI_HIS_CODE_SRV as HIS_CODE,
  SCIManagementService.SCI_MST_SYSTEMLIST_SRV as MST_SYSTEMLIST,
  SCIManagementService.SCI_HIS_SYSTEMLIST_SRV as HIS_SYSTEMLIST,
  SCIManagementService.SCI_TP_INTERFACELIST_SRV as TP_INTERFACELIST,
  SCIManagementService.SCI_HIS_INTERFACELIST_SRV as HIS_INTERFACELIST,
  SCIManagementService.SCI_TP_BATCH_SRV as TP_BATCH,
  SCIManagementService.SCI_HIS_BATCH_SRV as HIS_BATCH
} from './SCIManagement';

annotate Service with @(
  title : 'SCI Management Service',
  path  : '/management'
);

annotate TP_INTERFACELIST with @title : 'Interface List Table' {};
annotate SCI_HIS_INTERFACELIST_SRV with @(
  title : 'Interface List History Table',
  readonly
);

annotate SCI_TP_BATCH_SRV with @(title : 'Batch List Table', );
annotate SCI_HIS_BATCH_SRV with @(
  title : 'Batch List History Table',
  readonly
);

annotate MST_CODE with @title : 'Code Mater Service';
annotate HIS_CODE with @(
  title : 'Code Mater History Service',
  readonly
);

annotate MST_SYSTEMLIST with @title : 'System Mater Table';
annotate HIS_SYSTEMLIST with @(
  title : 'System Mater Hisotory Table',
  readonly
);
