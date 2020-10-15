using {
    SCI_TP0010,
    SCI_TP0010_HIST,
    SCI_MST0010,
    SCI_MST0010_HIST,
    SCI_MST0020,
    SCI_MST0020_HIST,
    SCI_TP0020
} from '../db/SCIManagement';


annotate SCI_TP0010 with @(
    assert.unique : {
        IF_NO   : [IF_NO],
        IF_NM   : [IF_NM],
        ASIS_NM : [IF_ASIS],
        PI_NM   : [PI_NM]
    },
    Capabilities  : {Deletable : false},
    title         : 'Interface List Table'
) {
    ID                   @description : 'Interface Key';
    IF_NO                @(
        description    : 'Interface Number',
        Core.Immutable : true,
        readonly
    );
    IF_NM                @description : 'Interface Name';
    IF_DESC              @description : 'Interface Description';
    STATUS_CD            @description : 'Interface Status';
    UNSUED_DT            @description : 'Unused Timestamp';
    PAKCAGE_NM           @description : 'Package Name it belongs';
    PI_NM                @description : 'Integration Flow Name in SCI';
    IF_ASIS              @description : 'As-Is Interface Number';
    IF_ASIS_NM           @description : 'As-Is Interface Name';
    IF_ASIS_DESC         @description : 'As-Is Interface Desription';
    SC_SYS_FK            @description : 'System''s Key that calls the interface';
    SC_IFTYPE_CD         @description : 'Source Interface Type';
    TG_SYS_FK            @description : 'System''s Key being called by the interface';
    TG_IFTYPE_CD         @description : 'Target Interface Type';
    RFC_NM               @description : 'ERP RFC NAME';
    ENTERPRSIESERVICE_NM @description : 'ERP Enterprise Servie Name';
    WEBSERVICE_NM        @description : 'ERP WebService Name';
    WEBBINDING_NM        @description : 'ERP WebBindg Name';
    EXECUTION_CD         @description : 'Is Interface  key';
    BATCHCYCLE_CD        @description : 'Batch check code (Real Time or Batch)';
    BATCH_TIME           @description : 'Batch Time';
    DELEDTED_TF          @description : 'Is Deleted';
};


annotate SCI_TP0010_HIST with @(
    title : 'Interface List Table History',
) {
    ID                   @description : 'Interface List History Key';
    TP0010               @description : 'Referenced Interface Key';
    IF_NO                @description : 'Interface Number';
    IF_NM                @description : 'Interface Name';
    IF_DESC              @description : 'Interface Description';
    STATUS_CD            @description : 'Interface Status';
    UNSUED_DT            @description : 'Unused Timestamp';
    PAKCAGE_NM           @description : 'Package Name it belongs';
    PI_NM                @description : 'Integration Flow Name in SCI';
    IF_ASIS              @description : 'As-Is Interface Number';
    IF_ASIS_NM           @description : 'As-Is Interface Name';
    IF_ASIS_DESC         @description : 'As-Is Interface Desription';
    IF_DIRECTION_CD      @description : 'Interface Direction (C or P)';
    SC_SYS_FK            @description : 'System''s Key that calls the interface';
    SC_IFTYPE_CD         @description : 'Source Interface Type';
    TG_SYS_FK            @description : 'System''s Key being called by the interface';
    TG_IFTYPE_CD         @description : 'Target Interface Type';
    RFC_NM               @description : 'ERP RFC NAME';
    ENTERPRSIESERVICE_NM @description : 'ERP Enterprise Servie Name';
    WEBSERVICE_NM        @description : 'ERP WebService Name';
    WEBBINDING_NM        @description : 'ERP WebBindg Name';
    EXECUTION_CD         @description : 'Is Interface  key';
    BATCHCYCLE_CD        @description : 'Batch check code (Real Time or Batch)';
    BATCH_TIME           @description : 'Batch Time';
    DELEDTED_TF          @description : 'Is Deleted';
};


annotate SCI_MST0010 with @(
    assert.unique : {CATEGORY : [
    CAT01,
    CAT02,
    CAT03,
    CODE
    ]},
    Capabilities  : {Deletable : false},
    title         : 'Code Mater Table'
) {
    ID         @description : 'Code Key';
    CAT01      @description : 'Main Category';
    CAT02      @description : 'Middle Category';
    CAT03      @description : 'SubCategory';
    CODE       @description : 'Code Name';
    DESC01     @description : 'Code Description1';
    DESC02     @description : 'Code Description2';
    DELETED_TF @description : 'Is Deleted';
    modifiedAt
}


annotate SCI_MST0010_HIST with @(
    title : 'Code Mater History Table'
) {
    ID         @description : 'Code History Key';
    MST0010    @description : 'Referenced Code Key';
    CAT01      @description : 'Main Category';
    CAT02      @description : 'Middle Category';
    CAT03      @description : 'SubCategory';
    CODE       @description : 'Code Name';
    DESC01     @description : 'Code Description1';
    DESC02     @description : 'Code Description2';
    DELETED_TF @description : 'Is Deleted';
}


annotate SCI_MST0020 with @(
    assert.unique : {CONTENTS : [
    COMPANY_CD,
    SUBSIDARY_CD,
    SYSTEM_NM,
    APPL_NM,
    APPPLTYPE_CD
    ]},
    Capabilities  : {Deletable : false},
    title         : 'System Mater Table'
) {
    ID           @description : 'System Key';
    COMPANY_CD   @description : 'Company Code';
    SUBSIDARY_CD @description : 'Susbsidary Code';
    SYSTEM_NM    @description : 'System Name';
    APPL_NM      @description : 'Application Name';
    APPPLTYPE_CD @description : 'Application Type Code';
    DELETED_TF   @description : 'Is Deleted';
    modifiedAt
}


annotate SCI_MST0020_HIST with @(
    title : 'System Mater History Table'
) {
    ID           @description : 'System History Key';
    MST0020      @description : 'Referenced System Key';
    COMPANY_CD   @description : 'Company Code';
    SUBSIDARY_CD @description : 'Susbsidary Code';
    SYSTEM_NM    @description : 'System Name';
    APPL_NM      @description : 'Application Name';
    APPPLTYPE_CD @description : 'Application Type Code';
    DELETED_TF   @description : 'Is Deleted';
}

annotate SCI_TP0020 with @(
    title : 'SCI BATCH LIST TABLE',
) {
    TP0010          @description : 'REFERENCED TP0010 KEY';
    EXECUTION_CD    @description : '특정일 지정/주기 반복';
    CYCLE_CD        @description : '특정시간 지정/반복 주기 지정';
    RECUR_CD        @description : '매일/매주/매년';
    ONTIME_T        @description : '지정 시간';
    TIMEINTERVAL_CD @description : '시간 간격';
    ONFRDATE        @description : '지정 시작시간';
    ONTODATE        @description : '지정 멈춤시간';
    TIMEZONE        @description : '타임존(디폴트 값: 한국)';
}

annotate SCI_TP0020_HIST with @(
    title : 'SCI BATCH LIST History Table',
) {
    TP0020          @description : 'REFERENCED TP0020 KEY';
    TP0010          @description : 'REFERENCED TP0010 KEY';
    EXECUTION_CD    @description : '특정일 지정/주기 반복';
    CYCLE_CD        @description : '특정시간 지정/반복 주기 지정';
    RECUR_CD        @description : '매일/매주/매년';
    ONTIME_T        @description : '지정 시간';
    TIMEINTERVAL_CD @description : '시간 간격';
    ONFRDATE        @description : '지정 시작시간';
    ONTODATE        @description : '지정 멈춤시간';
    TIMEZONE        @description : '타임존(디폴트 값: 한국)';
}

