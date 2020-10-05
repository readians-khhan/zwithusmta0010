sap.ui.define(['sap/ui/base/Object', 'sap/ui/model/json/JSONModel'], function (Object, JSONModel) {
  'use strict';

  return Object.extend('withus.sci.management.SCIManagement.model.common.DataHub', {
    /**
     * 공통변수
     * manifest : manifest 설정정보
     * device : device 모델
     * i18n : i18n 리소스 번들
     */
    manifest: null,
    device: null,
    i18n: null,
    router: null,
    nameSpace: 'withus.sci.management.SCIManagement',

    /**
     * 초기 설정 값
     */
    mainViewInitData: {
      busy: false,
      search: '',
      bpSearch: '',
      condition: {
        iconKey: 'T',
        fromDate: null,
        toDate: null
      },
      action: '',
      selectBPType: 'vendor',
      hasError: false,
      hasUIChanges: false,
      stickyOptions: ['HeaderToolbar', 'ColumnHeaders'],
      statusCount: {
        total: 0,
        draft: 0,
        request: 0,
        reject: 0,
        approval: 0,
        cancel: 0
      },
      bpDetail: null,
      reqDate: '',
      select: true,
      isModification: false,
      isCreator: false,
      isAdmin: false,
      isApprover: false,
      isRequestor: false,
      userId: '',
      convertStatus: '',
      requestHistory: [],
      approveDetail: {
        Title: '',
        Comments: ''
      },
      rejectDetail: {
        Title: '',
        Comments: ''
      },
      SAPURL: '',
      ApiLog: ''
    },

    detailViewInitData: {
      busy: false,
      bpData: null,
      bpTable: null,
      bpContext: null,
      bpStatus: '',
      bpCreatedBy: '',
      selectBPType: 'vendor',
      edit: true,
      review: false,
      isModification: false,
      isCreator: false,
      isAdmin: false,
      isApprover: false,

      RequestDate: null,

      Wizard: {
        Step_General: true,
        Step_Address: true,
        Step_StandardCommunication: true,
        Step_BankAccount: true,
        Step_PaymentTerms: true,
        Step_TaxNumbers: true,
        Step_PurchasingOrganizations: true,
        Step_SalesOrganizations: true,
        Step_SalesAreas: true,
        Step_Companycode: true
      },

      WizardNextStep: {
        Step_General: 'Address',
        Step_Address: 'StandardCommunication',
        Step_StandardCommunication: 'BankAccount',
        Step_BankAccount: 'PaymentTerms',
        Step_PaymentTerms: 'TaxNumbers',
        Step_TaxNumbers: 'PurchasingOrganizations',
        Step_PurchasingOrganizations: 'Companycode',
        Step_SalesOrganizations: 'SalesAreas',
        Step_SalesAreas: 'Companycode',
        Step_Companycode: ''
      },
      WizardReviewText: {
        Step_General: 'General Data',
        Step_Address: 'Address',
        Step_StandardCommunication: 'Standard Communication',
        Step_BankAccount: 'Bank Account',
        Step_PaymentTerms: 'Payment Terms',
        Step_TaxNumbers: 'Tax Numbers',
        Step_PurchasingOrganizations: 'Purchasing Organization',
        Step_SalesOrganizations: 'Sales Organization',
        Step_SalesAreas: 'Tax & Partner Functions',
        Step_Companycode: 'Company'
      },
      WizardValidate: {
        GeneralData: false,
        Address: false,
        StandardCommunication: false,
        BankAccount: false,
        PaymentTerms: false,
        TaxNumbers: false,
        PurchasingOrganizations: false,
        SalesOrganizations: false,
        SalesAreas: false,
        Companycode: false
      },

      GeneralData: {
        ID: '',
        BusinessPartner: '',
        Customer: '',
        CustomerDesc: '',
        Supplier: '',
        SupplierDesc: '',
        FirstName: '',
        OrganizationBPName1: '',
        SupplierAccountGroup: '',
        BusinessPartnerGrouping: '',
        BusinessPartnerGroupingDesc: '',
        SearchTerm1: ''
      },

      Roles: [],

      Address: {
        BusinessPartner: '',
        AddressID: '',
        StreetName: '',
        HouseNumber: '',
        PostalCode: '',
        CityName: '',
        POBoxPostalCode: '',
        POBox: '',
        Country: '',
        CountryDesc: '',
        Region: '',
        RegionDesc: '',
        TaxJurisdiction: '7700000000',
        TaxJurisdictionDesc: '',
        PostalCode_VS: 'None',
        PostalCode_VS_Text: '',
        POBoxPostalCode_VS: 'None',
        POBoxPostalCode_VS_Text: '',
        POBox_VS: 'None',
        POBox_VS_Text: '',
        messageStrip: ''
      },

      StandardCommunication: {
        BusinessPartner: '',
        CorrespondenceLanguage: 'EN',
        CorrespondenceLanguageDesc: '',
        AddressID_Telephone: '',
        OrdinalNumber_Telephone: '',
        DestinationLocationCountry: '',
        DestinationLocationCountryDesc: '',
        PhoneNumber: '',
        AddressID_CellPhone: '',
        OrdinalNumber_CellPhone: '',
        DestLocationCountryCellPhone: '',
        DestLocationCountryCellPhoneDesc: '',
        CellPhoneNumber: '',
        AddressID_Fax: '',
        OrdinalNumber_Fax: '',
        FaxCountry: '',
        FaxCountryDesc: '',
        FaxNumber: '',
        AddressID_Email: '',
        OrdinalNumber_Email: '',
        EmailAddress: '',
        CheckEmail: 'None'
      },

      BankAccount: {
        BusinessPartner: '',
        BankIdentification: '',
        BankCountryKey: '',
        BankCountryKeyName: '',
        BankNumber: '',
        BankNumberName: '',
        BankAccount: '',
        BankAccountHolderName: '',
        BankAccountReferenceText: '',
        IBAN: '',
        SWIFTCode: '',
        BankControlKey: '',
        BankAccountNumber_VS: 'None',
        BankAccountNumber_VS_Text: '',
        messageStrip: ''
      },

      PaymentTerms: {
        PaymentTerms: '',
        PaymentTermsDesc: ''
      },

      TaxNumbers: {
        BusinessPartner: '',
        BPTaxType: '',
        BPTaxTypeDesc: '',
        BPTaxNumber: '',
        BPTaxNumber_VS: 'None',
        BPTaxNumber_VS_Text: '',
        messageStrip: ''
      },

      PurchasingOrganizations: {
        Supplier: '',
        PurchasingOrganization: '',
        PurchasingOrganizationName: '',
        PurchasingGroup: '',
        PurchasingGroupName: '',
        PurchaseOrderCurrency: 'USD',
        PurchaseOrderCurrencyName: '',
        PaymentTermsPurchasing: '',
        PaymentTermsPurchasingName: '',
        IncotermsVersion: '',
        IncotermsVersionName: '',
        IncotermsClassification: '',
        IncotermsClassificationDesc: '',
        IncotermsLocation1: '',
        IncotermsLocation2: '',
        InvoiceIsGoodsReceiptBased: false
      },

      PurchasingOrganizations_VS: {
        IncotermsLocation1: true,
        IncotermsLocation1_Text: ''
      },

      SalesOrganizations: {
        Customer: '',
        SalesOrganization: '1710',
        SalesOrganizationName: '',
        DistributionChannel: '10',
        DistributionChannelName: '',
        Division: '00',
        DivisionName: '',
        SalesDistrict: '',
        SalesDistrictName: '',
        SalesOffice: '',
        SalesOfficeName: '',
        Currency: '',
        CustomerPaymentTerms: '',
        CustomerPaymentTermsName: '',
        IncotermsVersion: '',
        IncotermsVersionName: '',
        IncotermsClassification: '',
        IncotermsClassificationName: '',
        IncotermsLocation1: '',
        IncotermsLocation2: '',
        SupplyingPlant: '',
        SupplyingPlantName: '',
        ShippingCondition: '',
        ShippingConditionName: '',
        OrderCombinationIsAllowed: false,
        CustomerAccountAssignmentGroup: '',
        CustomerAccountAssgmtGrpName: '',
        PartialDeliveryIsAllowed: '',
        PartialDeliveryIsAllowedText: '',
        CompleteDeliveryIsDefined: false
      },

      SalesOrganizations_VS: {
        IncotermsLocation1: true,
        IncotermsLocation1_Text: ''
      },

      CustomerTax: {
        Customer: '',
        SalesOrganization: '',
        DistributionChannel: '',
        Division: '',
        DepartureCountry: '',
        DepartureCountryName: '',
        CustomerTaxCategory: 'UTXJ',
        CustomerTaxClassification: '',
        CustomerTaxClassificationName: ''
      },

      CustomerPartnerFunctions: [],
      CustomerPFmessageStrip: '',

      Companycode: {
        Supplier: '',
        Customer: '',
        CompanyCode: '1710',
        ReconciliationAccount: '',
        PaymentTerms: '',
        PaymentTermsName: ''
      },

      Attachment: [],

      RequestDetail: {
        Title: '',
        Comments: '',
        Approver: '',
        ApproverDesc: ''
      },

      BPLanguageData: [
        {
          Name: 'EN',
          Description: 'English'
        },
        {
          Name: 'KO',
          Description: 'Korean'
        },
        {
          Name: 'DE',
          Description: 'German'
        },
        {
          Name: 'ZH',
          Description: 'Chinese'
        },
        {
          Name: 'JA',
          Description: 'Japanese'
        }
      ],
      selectApprovertype: '',
      BPType: '',
      requestType: '',
      isNew: false,
      ActiveBankAccount: false,
      ActivePurchasingOrganizations: false,
      ActiveSalesOrganizations: false,
      CountryCodeCheck: [],
      bpInfoSearch: '',
      editPartnerFunction: true,
      SelectedPartnerFunction: '',
      userId: '',
      isExistSalesOrganizations: true
    },

    adminViewInitData: {
      addCode: {
        cellphoneCountry: {
          cellphoneCountry: '',
          cellphoneTaxCountryCode: ''
        },
        bpGrouping: {
          bpGroupingCode: '',
          BPType: '',
          fieldName: ''
        },
        approver: {
          approverName: '',
          approverID: '',
          approverEmail: ''
        },
        administrator: {
          accountType: '',
          accountNumber: ''
        },
        deliveryPlant: {
          deliveryPlant: '',
          name: ''
        },
        faxCountry: {
          faxCountry: '',
          faxCountryCode: ''
        },
        incotermsVersion: {
          incoterms: '',
          incotermsVersion: ''
        },
        language: {
          country: '',
          language: ''
        },
        taxCategory: {
          country: '',
          taxCategory: ''
        },
        telephoneCountry: {
          country: '',
          telephoneCountry: ''
        }
      },
      busy: false,
      sideExpanded: true,
      editMode: 'Inactive',
      Regex: {
        Email: '[^@]+@[^.]+..+'
      },
      selectBPType: 'vendor'
    },
    /**
     * OData모델객체
     */
    bptype: null,
    bpReg: null,
    bpInfo: null,
    countryCode: null,
    regionVH: null,
    taxjurisdiction: null,
    purchasingGroup: null,
    purchasingOrg: null,
    supplier: null,
    incoterms: null,
    bpWorkflow: null,
    distributionChannel: null,
    salesOrg: null,
    division: null,
    salesDistrict: null,
    salesOffice: null,
    currency: null,
    customerPaymentTerms: null,
    shippingConditioin: null,
    accountAssignmentGroup: null,
    partialDeliveryItem: null,
    taxClassification: null,
    apiBP: null,
    roles: null,
    partnerFunctions: null,

    /**
     * Main뷰 모델
     */
    mainData: null,
    mainView: null,
    detailData: null,
    detailView: null,
    adminData: null,
    adminView: null,

    mainDataInitData: {
      VendorList: {}
    },

    detailDataInitData: {},
    /**
     * Data Trasport
     * bpType : vendor/customer
     */
    oToDetail: {
      bpType: '',
      bpTable: null,
      bpContext: null,
      bpData: null,
      bpUserId: ''
    },

    adminDataInitData: {},

    bpWorkflowURL: '/backend/bpworkflow/BPWorkflows_SRV'
  });
});
