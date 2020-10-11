using {
  SCIManagementService                                 as Service,
  SCIManagementService.SCI_MST_CODE_SRV                as MST_CODE,
  SCIManagementService.SCI_TP_INTERFACELIST_SRV        as TP_INTERFACELIST
} from './SCIManagement';

annotate Service with @(
  title : 'SCI Management Service',
  path  : '/management'
);

annotate TP_INTERFACELIST with @title : 'Interface List Table' {};

annotate MST_CODE with @title : 'Code Mater Service' {};

annotate MST_SYSTEMLIST with @title : 'System Mater Table' {};

