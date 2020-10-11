using {
  SCIManagementService.SCI_VH_CODE_COMPANY_SRV         as VH_COMPANY,
  SCIManagementService.SCI_VH_CODE_SUBSIDARY_SRV       as VH_SUBSIDARY,
  SCIManagementService.SCI_VH_CODE_APPLICATIONTYPE_SRV as VH_APPLTYPE,
  SCIManagementService.SCI_VH_CODE_IFSTATUS_SRV        as VH_IFSTATUS,
  SCIManagementService.SCI_VH_CODE_IFPROTOCOL_SRV      as VH_IFPROTOCAL,
  SCIManagementService.SCI_VH_CODE_IFEXECUTION_SRV     as VH_IFEXECUTION,
  SCIManagementService.SCI_VH_CODE_IFCYCLE_SRV         as VH_IFCYCLE,
  SCIManagementService.SCI_VH_SYSTEMLIST_SRV           as VH_SYSTEMLIST,
  SCIManagementService.SCI_VH_CODE_BATCHEXEC_SRV as VH_BATCHEXEC,
  SCIManagementService.SCI_VH_CODE_BATCHCYCLE_SRV as VH_BATCHCYCLE,
  SCIManagementService.SCI_VH_CODE_BATCHTIMEINTERVAL_SRV as VH_BATCHTIMEINTERVAL,
  SCIManagementService.SCI_VH_CODE_BATCHRECUR_SRV as VH_BATCHRECUR
} from './SCIValueHelp';

annotate Service with @(
  title : 'SCI Management Service',
  path  : '/management'
);

annotate TP_INTERFACELIST with @title : 'Interface List Table' {};

annotate MST_CODE with @title : 'Code Mater Service' {};
annotate VH_COMPANY with @(
  readonly,
  title : 'Code Company Mater ValueHelp'
);
annotate VH_SUBSIDARY with @(
  readonly,
  title : 'Code Subsidary Mater ValueHelp'
);
annotate VH_APPLTYPE with @(
  readonly,
  title : 'Code Application Type Mater ValueHelp'
);
annotate VH_IFSTATUS with @(
  readonly,
  title : 'Code Mater Interface Status ValueHelp'
);
annotate VH_IFPROTOCAL with @(
  readonly,
  title : 'Code Mater Interface Protocol ValueHelp'
);
annotate VH_IFEXECUTION with @(
  readonly,
  title : 'Code Mater Interface Execution ValueHelp'
);
annotate VH_IFCYCLE with @(
  readonly,
  title : 'Code Mater Interface Cycle ValueHelp'
);
annotate VH_BATCHEXEC with @(
  readonly,
  title : 'Code Mater Interface Batch Execution ValueHelp'
);
annotate VH_BATCHCYCLE with @(
  readonly,
  title : 'Code Mater Interface Batch Cycle ValueHelp'
);
annotate VH_BATCHTIMEINTERVAL with @(
  readonly,
  title : 'Code Mater Interface Batch Time Interval ValueHelp'
);
annotate VH_BATCHRECUR with @(
  readonly,
  title : 'Code Mater Interface Batch Recursive ValueHelp'
);


annotate VH_SYSTEMLIST with @(
  title : 'System Mater ValueHelp',
  readonly
);
