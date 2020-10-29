using {
    cuid,
    managed
} from '@sap/cds/common';

type ATHENTIC_TYPE {
    TYPE           : Integer enum {
        BASOIC = 0;
        OAUTH  = 1
    };
    LOGINID        : String(100);
    LOGINPWD       : String(100);
    ACCESSTOKENURL : String(100);
    CLIENTID       : String(100);
    CLIENTSECRET   : String(100);
}

define entity SCI_TP0010 : cuid, managed {
    IF_NO                : Integer;
    IF_NM                : String(50) not null;
    IF_DESC              : String(100);
    STATUS_CD            : Association to one SCI_MST0010 not null;
    UNSUED_DT            : Timestamp;
    PAKCAGE_NM           : String(50);
    PI_NM                : String(50);
    IF_ASIS              : String(20);
    IF_ASIS_NM           : String(50);
    IF_ASIS_DESC         : String(100);
    SC_SYS_FK            : Association to SCI_MST0020 not null;
    SC_IFTYPE_CD         : Association to one SCI_MST0010 not null;
    TG_SYS_FK            : Association to SCI_MST0020 not null;
    TG_IFTYPE_CD         : Association to one SCI_MST0010 not null;
    RFC_NM               : String(50);
    ENTERPRSIESERVICE_NM : String(50);
    WEBSERVICE_NM        : String(50);
    WEBBINDING_NM        : String(50);
    EXECUTION_CD         : Association to one SCI_MST0010 not null;
    DELETED_TF          : Boolean not null default false;
    BATCH                : Composition of many SCI_TP0020
                               on BATCH.TP0010 = $self;
    HISTORY              : Association to many SCI_TP0010_HIST
                               on HISTORY.TP0010 = $self;
}

define entity SCI_TP0010_HIST : cuid, managed {
    TP0010               : Association to SCI_TP0010;
    IF_NO                : Integer;
    IF_NM                : String(50) not null;
    IF_DESC              : String(100);
    STATUS_CD            : Association to one SCI_MST0010 not null;
    UNSUED_DT            : Timestamp;
    PAKCAGE_NM           : String(50);
    PI_NM                : String(50);
    IF_ASIS              : String(20);
    IF_ASIS_NM           : String(50);
    IF_ASIS_DESC         : String(100);
    SC_SYS_FK            : Association to SCI_MST0020 not null;
    SC_IFTYPE_CD         : Association to one SCI_MST0010 not null;
    TG_SYS_FK            : Association to SCI_MST0020 not null;
    TG_IFTYPE_CD         : Association to one SCI_MST0010 not null;
    RFC_NM               : String(50);
    ENTERPRSIESERVICE_NM : String(50);
    WEBSERVICE_NM        : String(50);
    WEBBINDING_NM        : String(50);
    EXECUTION_CD         : Association to one SCI_MST0010 not null;
    DELETED_TF          : Boolean not null default false;
}

define entity SCI_MST0010 : cuid, managed {
    CAT01      : String(20) not null;
    CAT02      : String(20);
    CAT03      : String(20);
    CODE       : String(50) not null;
    DESC01     : String(100) not null;
    DESC02     : String(100);
    DELETED_TF : Boolean not null default false;
    HISTORY    : Association to many SCI_MST0010_HIST
                     on HISTORY.MST0010 = $self;
}

define entity SCI_MST0010_HIST : cuid, managed {
    MST0010    : Association to one SCI_MST0010;
    CAT01      : String(20) not null;
    CAT02      : String(20);
    CAT03      : String(20);
    CODE       : String(20) not null;
    DESC01     : String(100) not null;
    DESC02     : String(100);
    DELETED_TF : Boolean not null default false;
}


define entity SCI_MST0020 : cuid, managed {
    COMPANY_CD   : Association to one SCI_MST0010;
    SUBSIDARY_CD : Association to one SCI_MST0010;
    SYSTEM_NM    : String(50) not null;
    APPL_NM      : String(20) not null;
    APPPLTYPE_CD : Association to one SCI_MST0010 not null;
    DESCRIPTION  : String(200);
    MANAGER      : Composition of many SCI_TP0030
                       on MANAGER.MST0020 = $self;
    IP           : String(15);
    HOST         : String(100);
    PORT         : String(5);
    ATHENTIC     : ATHENTIC_TYPE;
    DELETED_TF   : Boolean not null default false;
    HISTORY      : Association to many SCI_MST0020_HIST
                       on HISTORY.MST0020 = $self;
}


define entity SCI_MST0020_HIST : cuid, managed {
    MST0020      : Association to SCI_MST0020;
    COMPANY_CD   : Association to one SCI_MST0010;
    SUBSIDARY_CD : Association to one SCI_MST0010;
    DESCRIPTION  : String(200);
    SYSTEM_NM    : String(50) not null;
    APPL_NM      : String(20) not null;
    IP           : String(15);
    HOST         : String(100);
    PORT         : String(5);
    ATHENTIC     : ATHENTIC_TYPE;
    APPPLTYPE_CD : Association to one SCI_MST0010 not null;
    DELETED_TF   : Boolean not null default false;
}


define entity SCI_TP0020 : cuid, managed {
    TP0010          : Association to SCI_TP0010 not null;
    EXECUTION_CD    : Association to one SCI_MST0010;
    CYCLE_CD        : Association to one SCI_MST0010;
    RECUR_CD        : Association to one SCI_MST0010;
    ONDATE_D        : Date;
    TIMEINTERVAL_CD : Association to one SCI_MST0010;
    ONFRTIME_T      : Time;
    ONTOTIME_T      : Time;
    DELETED_TF      : Boolean not null default false;
    TIMEZONE        : String default '한국/서울 +9:00';
}


define entity SCI_TP0030 : cuid, managed {
    MST0020 : Association to SCI_MST0020;
    NAME    : String(50);
    PHONE   : String(50);
    EMAIL   : String(50);
}

// 담당자 테이블
define entity SCI_TP0020_HIST : cuid, managed {
    TP0020          : Association to SCI_TP0020;
    TP0010          : Association to SCI_TP0010;
    EXECUTION_CD    : Association to one SCI_MST0010;
    CYCLE_CD        : Association to one SCI_MST0010;
    RECUR_CD        : Association to one SCI_MST0010;
    ONDATE_D        : Date;
    TIMEINTERVAL_CD : Association to one SCI_MST0010;
    ONFRTIME_T      : Time;
    ONTOTIME_T      : Time;
    DELETED_TF      : Boolean not null default false;
    TIMEZONE        : String default '한국/서울 +9:00';
}
