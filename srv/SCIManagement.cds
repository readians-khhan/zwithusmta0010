using {
  SCI_TP0010  as TP0010,
  SCI_MST0010 as MST0010,
  SCI_MST0020 as MST0020
} from '../db/SCIManagement';

service SCIManagementService {
  entity SCI_TP_INTERFACELIST_SRV as projection on TP0010 {
    * , 
    STATUS_CD : redirected to SCI_MST_CODE_SRV, 
    SC_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    SC_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    TG_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    TG_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    EXECUTION_CD : redirected to SCI_MST_CODE_SRV
  };

  entity SCI_MST_CODE_SRV         as projection on MST0010;
  
  entity SCI_MST_SYSTEMLIST_SRV   as projection on MST0020 {
      * , 
      COMPANY_CD : redirected to SCI_MST_CODE_SRV, 
      SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV, 
      APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV
  };

  @requires : 'authenticated-user'
  action sendErrorEmail();
}
