using {
  SCI_TP0010       as TP0010,
  SCI_TP0020       as TP0020,
  SCI_MST0010      as MST0010,
  SCI_MST0020      as MST0020,
  SCI_MST0010_HIST as MST0010_HIST,
  SCI_MST0020_HIST as MST0020_HIST,
  SCI_TP0010_HIST  as TP0010_HIST,
  SCI_TP0020_HIST  as TP0020_HIST

} from '../db/SCIManagement';

service SCIManagementService @(requires: ['authenticated-user']){
  entity SCI_TP_INTERFACELIST_SRV  as projection on TP0010 {
    * , 
    STATUS_CD : redirected to SCI_MST_CODE_SRV, 
    SC_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    SC_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    TG_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    TG_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    EXECUTION_CD : redirected to SCI_MST_CODE_SRV
  } where BATCH.DELETED_TF = false;

  entity SCI_HIS_INTERFACELIST_SRV as projection on TP0010_HIST {
    * ,
    TP0010 : redirected to SCI_TP_INTERFACELIST_SRV,
    STATUS_CD : redirected to SCI_MST_CODE_SRV, 
    SC_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    SC_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    TG_SYS_FK : redirected to SCI_MST_SYSTEMLIST_SRV, 
    TG_IFTYPE_CD : redirected to SCI_MST_CODE_SRV, 
    EXECUTION_CD : redirected to SCI_MST_CODE_SRV
  };
  
  entity SCI_TP_BATCH_SRV          as projection on TP0020{
    * , 
    TP0010 : redirected to SCI_TP_INTERFACELIST_SRV, 
    EXECUTION_CD : redirected to SCI_MST_CODE_SRV, 
    CYCLE_CD : redirected to SCI_MST_CODE_SRV, 
    RECUR_CD : redirected to SCI_MST_CODE_SRV, 
    TIMEINTERVAL_CD : redirected to SCI_MST_CODE_SRV
  };
  entity SCI_HIS_BATCH_SRV         as projection on TP0020_HIST {
    * , 
    TP0010 : redirected to SCI_TP_INTERFACELIST_SRV, 
    EXECUTION_CD : redirected to SCI_MST_CODE_SRV, 
    CYCLE_CD : redirected to SCI_MST_CODE_SRV, 
    RECUR_CD : redirected to SCI_MST_CODE_SRV, 
    TIMEINTERVAL_CD : redirected to SCI_MST_CODE_SRV
  };
  
  entity SCI_MST_CODE_SRV          as projection on MST0010;
  entity SCI_HIS_CODE_SRV          as projection on MST0010_HIST {
    * , 
    MST0010 : redirected to SCI_MST_CODE_SRV
  };

  entity SCI_MST_SYSTEMLIST_SRV    as projection on MST0020 {
    * , 
    COMPANY_CD : redirected to SCI_MST_CODE_SRV, 
    SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV, 
    APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV
  };
  entity SCI_HIS_SYSTEMLIST_SRV    as projection on MST0020_HIST {
    * ,
    MST0020 : redirected to SCI_MST_SYSTEMLIST_SRV,
    COMPANY_CD : redirected to SCI_MST_CODE_SRV, 
    SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV, 
    APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV
  };

  @requires : 'authenticated-user'
  action sendErrorEmail();
}
