using {
  SCI_TP0010       as TP0010,
  SCI_TP0020       as TP0020,
  SCI_TP0030       as TP0030,
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
    COMPANY_CD   : redirected to SCI_MST_CODE_SRV,
    COMPANY_CD.CODE     AS COMPANY_CODE,
    COMPANY_CD.DESC01   AS COMPANY_DESC01,
    COMPANY_CD.DESC02   AS COMPANY_DESC02, 
    SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV,
    SUBSIDARY_CD.CODE   AS SUBSIDARY_CODE,
    SUBSIDARY_CD.DESC01 AS SUBSIDARY_DESC01,
    SUBSIDARY_CD.DESC02 AS SUBSIDARY_DESC02,
    APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV,
    APPPLTYPE_CD.CODE   AS APPLTYPE_CODE,
    APPPLTYPE_CD.DESC01 AS APPLTYPE_DESC01,
    APPPLTYPE_CD.DESC02 AS APPLTYPE_DESC02,
    HISTORY : redirected to SCI_HIS_SYSTEMLIST_SRV,
  };
  entity SCI_HIS_SYSTEMLIST_SRV    as projection on MST0020_HIST {
    * ,
    MST0020 : redirected to SCI_MST_SYSTEMLIST_SRV,
    COMPANY_CD : redirected to SCI_MST_CODE_SRV, 
    SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV, 
    APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV
  };

  entity SCI_TP_MANAGERLIST_SRV as projection on TP0030 {
    * ,
    MST0020 : redirected to SCI_MST_SYSTEMLIST_SRV
  };


  entity SCI_TP_SYSTEMLIST_SRV    as projection on MST0020_HIST {
    * ,
    MST0020 : redirected to SCI_MST_SYSTEMLIST_SRV,
    COMPANY_CD : redirected to SCI_MST_CODE_SRV, 
    SUBSIDARY_CD : redirected to SCI_MST_CODE_SRV, 
    APPPLTYPE_CD : redirected to SCI_MST_CODE_SRV
  };

  @requires : 'authenticated-user'
  action sendErrorEmail();
}
