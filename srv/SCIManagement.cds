using { SCI_TP0010 as TP0010 } from '../db/SCIManagement';
using { SCI_MST0010 as MST0010 } from '../db/SCIManagement';
using { SCI_MST0020 as MST0020 } from '../db/SCIManagement';


service SCIManagementService @(path : '/management') {

  entity SCI_TP_INTERFACELIST_SRV as projection on TP0010;

  entity SCI_MST_CODE_SRV as projection on MST0010;
  entity SCI_VH_CODE_SRV as projection on MST0010;
  
  entity SCI_MST_SYSTEMLIST_SRV as projection on MST0020;
  entity SCI_VH_SYSTEMLIST_SRV as projection on MST0020;

  @requires : 'authenticated-user'
  action sendErrorEmail();
}
