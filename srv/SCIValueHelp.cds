using {
  SCI_TP0010  as TP0010,
  SCI_MST0010 as MST0010,
  SCI_MST0020 as MST0020
} from '../db/SCIManagement';
using { SCIManagementService } from './SCIManagement';

extend service SCIManagementService with {
  view SCI_VH_CODE_COMPANY_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'COMPANY'
      and (CAT02 =  '' or CAT02 is null);

  view SCI_VH_CODE_SUBSIDARY_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'COMPANY'
      and CAT02      = 'SUBSIDARY'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_CODE_APPLICATIONTYPE_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'APPLICATION'
      and CAT02      = 'TYPE'
      and (CAT03 =  '' or CAT03 is null);


  view SCI_VH_CODE_IFSTATUS_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'INTERFACE'
      and CAT02      = 'STATUS'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_CODE_IFPROTOCOL_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'INTERFACE'
      and CAT02      = 'PROTOCOL'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_CODE_IFEXECUTION_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'INTERFACE'
      and CAT02      = 'EXECUTION'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_CODE_IFCYCLE_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'INTERFACE'
      and CAT02      = 'CYCLE'
      and (CAT03 =  '' or CAT03 is null);


  view SCI_VH_CODE_BATCHEXEC_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'BATCH'
      and CAT02      = 'EXECUTION'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_CODE_BATCHCYCLE_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'BATCH'
      and CAT02      = 'CYCLE'
      and (CAT03 =  '' or CAT03 is null);

   view SCI_VH_CODE_BATCHTIMEINTERVAL_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'BATCH'
      and CAT02      = 'TIMEINTERVAL'
      and (CAT03 =  '' or CAT03 is null);          

  view SCI_VH_CODE_BATCHRECUR_SRV as
    select from MST0010
    excluding {
      DELETED_TF,
      HISTORY
    }
    where DELETED_TF = false
      and CAT01      = 'BATCH'
      and CAT02      = 'RECUR'
      and (CAT03 =  '' or CAT03 is null);

  view SCI_VH_SYSTEMLIST_SRV as select from MST0020 {
      *,
      COMPANY_CD.CODE AS COMPANY_NM,
      SUBSIDARY_CD.CODE AS SUBSIDARY_NM,
      APPPLTYPE_CD.CODE AS APPPLTYPE_NM
    }
  excluding {
    DELETED_TF,
    HISTORY,
    COMPANY_CD,
    SUBSIDARY_CD,
    APPPLTYPE_CD
  }
  where DELETED_TF = false;

}
