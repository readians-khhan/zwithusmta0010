sap.ui.define([], function () {
  'use strict';

  return {
    makeBPToScreen: function (oBPData, sType) {
      if (_.isEmpty(oBPData)) {
        return;
      }

      // Screen Data
      var oGeneral_Data = {};
      var aRoles_Data = [];
      var oAddress_Data = {};
      var oStandardCommunication_Data = {};
      var oBankAccount_Data = {};
      var oPaymentTerms_Data = {};
      var oTaxNumbers_Data = {};
      var oPurchasingOrganizations_Data = {};
      var oSalesOrganizations_Data = {};
      var oCustomerTax_Data = {};
      var aCustomerPartnerFunctions_Data = [];
      var oCompanycode_Data = {};
      var aAttachment = [];

      // Business Partner Data
      var oGeneral_BP = _.omit(oBPData, [
        'roles',
        'addresses',
        'banks',
        'tax',
        'customer',
        'supplier',
      ]);
      var aRoles_BP = _.get(_.pick(oBPData, ['roles']), 'roles');
      var oAddresses_BP = _.get(_.pick(oBPData, ['addresses']), 'addresses[0]');
      var aCommunications = _.get(
        _.pick(oBPData, ['addresses']),
        'addresses[0].communications'
      );
      var oTelephone = _.find(aCommunications, {
        CommuncationType: 0,
        IsDefault: true,
      });
      if (_.isEmpty(oTelephone)) {
        oTelephone = _.find(aCommunications, { CommuncationType: 0 });
      }

      var oCellPhone = _.find(aCommunications, {
        CommuncationType: 1,
        IsDefault: true,
      });
      if (_.isEmpty(oCellPhone)) {
        oCellPhone = _.find(aCommunications, { CommuncationType: 1 });
      }

      var oFax = _.find(aCommunications, {
        CommuncationType: 2,
        IsDefault: true,
      });
      if (_.isEmpty(oFax)) {
        oFax = _.find(aCommunications, { CommuncationType: 2 });
      }

      var oEmail = _.find(aCommunications, { CommuncationType: 3 });
      if (_.isEmpty(oEmail)) {
        oEmail = _.find(aCommunications, {
          CommuncationType: 3,
          IsDefault: true,
        });
      }

      var oBanks_BP = _.get(_.pick(oBPData, ['banks']), 'banks[0]');
      var oTax_BP = _.get(_.pick(oBPData, ['tax']), 'tax[0]');
      var oPaymentTerms_BP = _.get(
        _.pick(oBPData, ['paymentTerms']),
        'paymentTerms[0]'
      );
      var oCustomer_BP = _.get(_.pick(oBPData, ['customer']), 'customer[0]');
      var oCustomer_SalesArea_BP = _.get(
        _.pick(oBPData, ['customer']),
        'customer[0].salesArea[0]'
      );
      var oCustomer_SalesArea_Tax_BP = _.get(
        _.pick(oBPData, ['customer']),
        'customer[0].salesArea[0].tax[0]'
      );
      var aCustomer_SalesArea_PF_BP = _.get(
        _.pick(oBPData, ['customer']),
        'customer[0].salesArea[0].partnerFunction'
      );
      var oCustomer_Company_BP = _.get(
        _.pick(oBPData, ['customer']),
        'customer[0].company[0]'
      );
      var oSupplier_BP = _.get(_.pick(oBPData, ['supplier']), 'supplier[0]');
      var oSupplier_PurOrg_BP = _.get(
        _.pick(oBPData, ['supplier']),
        'supplier[0].purchaseOrg[0]'
      );
      var aSupplier_PurOrg_PF_BP = _.get(
        _.pick(oBPData, ['supplier']),
        'supplier[0].purchaseOrg[0].partnerFunction'
      );
      var oSupplier_Company_BP = _.get(
        _.pick(oBPData, ['supplier']),
        'supplier[0].company[0]'
      );
      var aAttachment_BP = _.get(
        _.pick(oBPData, ['attachments']),
        'attachments'
      );

      var bActiveBankAccount = null;
      if (oBPData.ActiveBankAccount !== null) {
        bActiveBankAccount = oBPData.ActiveBankAccount;
      } else {
        if (_.isEmpty(oBanks_BP)) {
          bActiveBankAccount = false;
        } else {
          bActiveBankAccount = true;
        }
      }

      var bActivePurchasingOrganizations = null;
      if (oBPData.ActivePurchasingOrganizations !== null) {
        bActivePurchasingOrganizations = oBPData.ActivePurchasingOrganizations;
      } else {
        if (_.isEmpty(oSupplier_PurOrg_BP)) {
          bActivePurchasingOrganizations = false;
        } else {
          bActivePurchasingOrganizations = true;
        }
      }

      var bActiveSalesOrganizations = null;
      if (oBPData.ActiveSalesOrganizations !== null) {
        bActiveSalesOrganizations = oBPData.ActiveSalesOrganizations;
      } else {
        if (_.isEmpty(oCustomer_SalesArea_BP)) {
          bActiveSalesOrganizations = false;
        } else {
          bActiveSalesOrganizations = true;
        }
      }

      // General Data
      oGeneral_Data.ID = _.get(oGeneral_BP, 'ID', '');
      oGeneral_Data.BusinessPartner = _.get(oGeneral_BP, 'BusinessPartner', '');
      oGeneral_Data.Customer = _.get(oGeneral_BP, 'Customer', '');
      oGeneral_Data.CustomerDesc = _.get(oGeneral_BP, 'CustomerDesc', '');
      oGeneral_Data.Supplier = _.get(oGeneral_BP, 'Supplier', '');
      oGeneral_Data.SupplierDesc = _.get(oGeneral_BP, 'SupplierDesc', '');
      oGeneral_Data.FirstName = _.get(oGeneral_BP, 'FirstName', '');
      oGeneral_Data.OrganizationBPName1 = _.get(
        oGeneral_BP,
        'OrganizationBPName1',
        ''
      );
      oGeneral_Data.SupplierAccountGroup = _.get(
        oGeneral_BP,
        'SupplierAccountGroup',
        ''
      );
      oGeneral_Data.BusinessPartnerGrouping = _.get(
        oGeneral_BP,
        'BusinessPartnerGrouping',
        ''
      );
      oGeneral_Data.BusinessPartnerGroupingDesc = _.get(
        oGeneral_BP,
        'BusinessPartnerGroupingDesc',
        ''
      );
      oGeneral_Data.SearchTerm1 = _.get(oGeneral_BP, 'SearchTerm1', '');

      // Roles
      aRoles_Data = _.map(aRoles_BP, function (oRole_BP) {
        return {
          BusinessPartnerRole: oRole_BP.BusinessPartnerRole,
          BusinessPartnerRoleName: oRole_BP.BusinessPartnerRoleName,
        };
      });

      // Address
      oAddress_Data.BusinessPartner = _.get(
        oAddresses_BP,
        'BusinessPartner',
        ''
      );
      oAddress_Data.AddressID = _.get(oAddresses_BP, 'AddressID', '');
      oAddress_Data.StreetName = _.get(oAddresses_BP, 'StreetName', '');
      oAddress_Data.HouseNumber = _.get(oAddresses_BP, 'HouseNumber', '');
      oAddress_Data.PostalCode = _.get(oAddresses_BP, 'PostalCode', '');
      oAddress_Data.CityName = _.get(oAddresses_BP, 'CityName', '');
      oAddress_Data.POBoxPostalCode = _.get(
        oAddresses_BP,
        'POBoxPostalCode',
        ''
      );
      oAddress_Data.POBox = _.get(oAddresses_BP, 'POBox', '');
      oAddress_Data.Country = _.get(oAddresses_BP, 'Country', '');
      oAddress_Data.CountryDesc = _.get(oAddresses_BP, 'CountryDesc', '');
      oAddress_Data.Region = _.get(oAddresses_BP, 'Region', '');
      oAddress_Data.RegionDesc = _.get(oAddresses_BP, 'RegionDesc', '');
      oAddress_Data.TaxJurisdiction = _.get(
        oAddresses_BP,
        'TaxJurisdiction',
        ''
      );
      oAddress_Data.TaxJurisdictionDesc = _.get(
        oAddresses_BP,
        'TaxJurisdictionDesc',
        ''
      );

      // StandardCommunication
      oStandardCommunication_Data.BusinessPartner = _.get(
        oAddresses_BP,
        'BusinessPartner',
        ''
      );
      oStandardCommunication_Data.CorrespondenceLanguage = _.get(
        oGeneral_BP,
        'CorrespondenceLanguage',
        ''
      );
      oStandardCommunication_Data.CorrespondenceLanguageDesc = _.get(
        oGeneral_BP,
        'CorrespondenceLanguageDesc',
        ''
      );
      oStandardCommunication_Data.AddressID_Telephone = _.get(
        oTelephone,
        'AddressID',
        ''
      );
      oStandardCommunication_Data.OrdinalNumber_Telephone = _.get(
        oTelephone,
        'OrdinalNumber',
        ''
      );
      oStandardCommunication_Data.DestinationLocationCountry = _.get(
        oTelephone,
        'DestinationLocationCountry',
        ''
      );
      oStandardCommunication_Data.DestinationLocationCountryDesc = _.get(
        oTelephone,
        'DestinationLocationCountryDesc',
        ''
      );
      oStandardCommunication_Data.PhoneNumber = _.get(oTelephone, 'Number', '');
      oStandardCommunication_Data.AddressID_CellPhone = _.get(
        oCellPhone,
        'AddressID',
        ''
      );
      oStandardCommunication_Data.OrdinalNumber_CellPhone = _.get(
        oCellPhone,
        'OrdinalNumber',
        ''
      );
      oStandardCommunication_Data.DestLocationCountryCellPhone = _.get(
        oCellPhone,
        'DestinationLocationCountry',
        ''
      );
      oStandardCommunication_Data.DestLocationCountryCellPhoneDesc = _.get(
        oCellPhone,
        'DestinationLocationCountryDesc',
        ''
      );
      oStandardCommunication_Data.CellPhoneNumber = _.get(
        oCellPhone,
        'Number',
        ''
      );
      oStandardCommunication_Data.AddressID_Fax = _.get(oFax, 'AddressID', '');
      oStandardCommunication_Data.OrdinalNumber_Fax = _.get(
        oFax,
        'OrdinalNumber',
        ''
      );
      oStandardCommunication_Data.FaxCountry = _.get(
        oFax,
        'DestinationLocationCountry',
        ''
      );
      oStandardCommunication_Data.FaxCountryDesc = _.get(
        oFax,
        'DestinationLocationCountryDesc',
        ''
      );
      oStandardCommunication_Data.FaxNumber = _.get(oFax, 'Number', '');
      oStandardCommunication_Data.AddressID_Email = _.get(
        oEmail,
        'AddressID',
        ''
      );
      oStandardCommunication_Data.OrdinalNumber_Email = _.get(
        oEmail,
        'OrdinalNumber',
        ''
      );
      oStandardCommunication_Data.EmailAddress = _.get(oEmail, 'Address', '');

      if (_.isEmpty(oStandardCommunication_Data.CorrespondenceLanguage)) {
        oStandardCommunication_Data.CorrespondenceLanguage = 'EN';
      }

      if (this.checkEmail(oStandardCommunication_Data.EmailAddress)) {
        oStandardCommunication_Data.CheckEmail = 'None';
      } else {
        oStandardCommunication_Data.CheckEmail = 'Error';
      }

      // BankAccount
      oBankAccount_Data.BusinessPartner = _.get(
        oBanks_BP,
        'BusinessPartner',
        ''
      );
      oBankAccount_Data.BankIdentification = _.get(
        oBanks_BP,
        'BankIdentification',
        ''
      );
      oBankAccount_Data.BankCountryKey = _.get(oBanks_BP, 'BankCountryKey', '');
      oBankAccount_Data.BankCountryKeyName = _.get(
        oBanks_BP,
        'BankCountryKeyName',
        ''
      );
      oBankAccount_Data.BankNumber = _.get(oBanks_BP, 'BankNumber', '');
      oBankAccount_Data.BankNumberName = _.get(oBanks_BP, 'BankNumberName', '');
      oBankAccount_Data.BankAccount = _.get(oBanks_BP, 'BankAccount', '');
      oBankAccount_Data.BankAccountHolderName = _.get(
        oBanks_BP,
        'BankAccountHolderName',
        ''
      );
      oBankAccount_Data.BankAccountReferenceText = _.get(
        oBanks_BP,
        'BankAccountReferenceText',
        ''
      );
      oBankAccount_Data.IBAN = _.get(oBanks_BP, 'IBAN', '');
      oBankAccount_Data.SWIFTCode = _.get(oBanks_BP, 'SWIFTCode', '');
      oBankAccount_Data.BankControlKey = _.get(oBanks_BP, 'BankControlKey', '');

      // TaxNumbers
      oTaxNumbers_Data.BusinessPartner = _.get(oTax_BP, 'BusinessPartner', '');
      oTaxNumbers_Data.BPTaxType = _.get(oTax_BP, 'BPTaxType', '');
      oTaxNumbers_Data.BPTaxTypeDesc = _.get(oTax_BP, 'BPTaxTypeDesc', '');
      oTaxNumbers_Data.BPTaxNumber = _.get(oTax_BP, 'BPTaxNumber', '');

      // PaymentTerms
      oPaymentTerms_Data.PaymentTerms = _.get(
        oPaymentTerms_BP,
        'PaymentTerms',
        ''
      );
      oPaymentTerms_Data.PaymentTermsDesc = _.get(
        oPaymentTerms_BP,
        'PaymentTermsName',
        ''
      );

      // PurchasingOrganizations
      oPurchasingOrganizations_Data.Supplier = _.get(
        oSupplier_PurOrg_BP,
        'Supplier',
        ''
      );
      oPurchasingOrganizations_Data.PurchasingOrganization = _.get(
        oSupplier_PurOrg_BP,
        'PurchasingOrganization',
        ''
      );
      oPurchasingOrganizations_Data.PurchasingOrganizationName = _.get(
        oSupplier_PurOrg_BP,
        'PurchasingOrganizationName',
        ''
      );
      oPurchasingOrganizations_Data.PurchasingGroup = _.get(
        oSupplier_PurOrg_BP,
        'PurchasingGroup',
        ''
      );
      oPurchasingOrganizations_Data.PurchasingGroupName = _.get(
        oSupplier_PurOrg_BP,
        'PurchasingGroupName',
        ''
      );
      oPurchasingOrganizations_Data.PurchaseOrderCurrency = _.get(
        oSupplier_PurOrg_BP,
        'PurchaseOrderCurrency',
        ''
      );
      oPurchasingOrganizations_Data.PurchaseOrderCurrencyName = _.get(
        oSupplier_PurOrg_BP,
        'PurchaseOrderCurrency',
        ''
      );
      oPurchasingOrganizations_Data.PaymentTermsPurchasing = _.get(
        oSupplier_PurOrg_BP,
        'PaymentTerms',
        ''
      );
      oPurchasingOrganizations_Data.PaymentTermsPurchasingName = _.get(
        oSupplier_PurOrg_BP,
        'PaymentTermsName',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsVersion = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsVersion',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsVersionName = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsVersionName',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsClassification = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsClassification',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsClassificationDesc = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsClassificationDesc',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsLocation1 = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsLocation1',
        ''
      );
      oPurchasingOrganizations_Data.IncotermsLocation2 = _.get(
        oSupplier_PurOrg_BP,
        'IncotermsLocation2',
        ''
      );
      oPurchasingOrganizations_Data.InvoiceIsGoodsReceiptBased = _.get(
        oSupplier_PurOrg_BP,
        'InvoiceIsGoodsReceiptBased',
        false
      );

      // SalesOrganizations
      oSalesOrganizations_Data.Customer = _.get(
        oCustomer_SalesArea_BP,
        'Customer',
        ''
      );
      oSalesOrganizations_Data.SalesOrganization = _.get(
        oCustomer_SalesArea_BP,
        'SalesOrganization',
        ''
      );
      oSalesOrganizations_Data.SalesOrganizationName = _.get(
        oCustomer_SalesArea_BP,
        'SalesOrganizationName',
        ''
      );
      oSalesOrganizations_Data.DistributionChannel = _.get(
        oCustomer_SalesArea_BP,
        'DistributionChannel',
        ''
      );
      oSalesOrganizations_Data.DistributionChannelName = _.get(
        oCustomer_SalesArea_BP,
        'DistributionChannelName',
        ''
      );
      oSalesOrganizations_Data.Division = _.get(
        oCustomer_SalesArea_BP,
        'Division',
        ''
      );
      oSalesOrganizations_Data.DivisionName = _.get(
        oCustomer_SalesArea_BP,
        'DivisionName',
        ''
      );
      oSalesOrganizations_Data.SalesDistrict = _.get(
        oCustomer_SalesArea_BP,
        'SalesDistrict',
        ''
      );
      oSalesOrganizations_Data.SalesDistrictName = _.get(
        oCustomer_SalesArea_BP,
        'SalesDistrictName',
        ''
      );
      oSalesOrganizations_Data.SalesOffice = _.get(
        oCustomer_SalesArea_BP,
        'SalesOffice',
        ''
      );
      oSalesOrganizations_Data.SalesOfficeName = _.get(
        oCustomer_SalesArea_BP,
        'SalesOfficeName',
        ''
      );
      oSalesOrganizations_Data.Currency = _.get(
        oCustomer_SalesArea_BP,
        'Currency',
        ''
      );
      oSalesOrganizations_Data.CustomerPaymentTerms = _.get(
        oCustomer_SalesArea_BP,
        'CustomerPaymentTerms',
        ''
      );
      oSalesOrganizations_Data.CustomerPaymentTermsName = _.get(
        oCustomer_SalesArea_BP,
        'CustomerPaymentTermsName',
        ''
      );
      oSalesOrganizations_Data.IncotermsVersion = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsVersion',
        ''
      );
      oSalesOrganizations_Data.IncotermsVersionName = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsVersionName',
        ''
      );
      oSalesOrganizations_Data.IncotermsClassification = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsClassification',
        ''
      );
      oSalesOrganizations_Data.IncotermsClassificationName = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsClassificationName',
        ''
      );
      oSalesOrganizations_Data.IncotermsLocation1 = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsLocation1',
        ''
      );
      oSalesOrganizations_Data.IncotermsLocation2 = _.get(
        oCustomer_SalesArea_BP,
        'IncotermsLocation2',
        ''
      );
      oSalesOrganizations_Data.SupplyingPlant = _.get(
        oCustomer_SalesArea_BP,
        'SupplyingPlant',
        ''
      );
      oSalesOrganizations_Data.SupplyingPlantName = _.get(
        oCustomer_SalesArea_BP,
        'SupplyingPlantName',
        ''
      );
      oSalesOrganizations_Data.ShippingCondition = _.get(
        oCustomer_SalesArea_BP,
        'ShippingCondition',
        ''
      );
      oSalesOrganizations_Data.ShippingConditionName = _.get(
        oCustomer_SalesArea_BP,
        'ShippingConditionName',
        ''
      );
      oSalesOrganizations_Data.OrderCombinationIsAllowed = _.get(
        oCustomer_SalesArea_BP,
        'OrderCombinationIsAllowed',
        false
      );
      oSalesOrganizations_Data.CustomerAccountAssignmentGroup = _.get(
        oCustomer_SalesArea_BP,
        'CustomerAccountAssignmentGroup',
        ''
      );
      oSalesOrganizations_Data.CustomerAccountAssgmtGrpName = _.get(
        oCustomer_SalesArea_BP,
        'CustomerAccountAssgmtGrpName',
        ''
      );
      oSalesOrganizations_Data.PartialDeliveryIsAllowed = _.get(
        oCustomer_SalesArea_BP,
        'PartialDeliveryIsAllowed',
        ''
      );
      oSalesOrganizations_Data.PartialDeliveryIsAllowedText = _.get(
        oCustomer_SalesArea_BP,
        'PartialDeliveryIsAllowedText',
        ''
      );
      oSalesOrganizations_Data.CompleteDeliveryIsDefined = _.get(
        oCustomer_SalesArea_BP,
        'CompleteDeliveryIsDefined',
        false
      );

      // CustomerTax
      oCustomerTax_Data.Customer = _.get(
        oCustomer_SalesArea_Tax_BP,
        'Customer',
        ''
      );
      oCustomerTax_Data.SalesOrganization = _.get(
        oCustomer_SalesArea_Tax_BP,
        'SalesOrganization',
        ''
      );
      oCustomerTax_Data.DistributionChannel = _.get(
        oCustomer_SalesArea_Tax_BP,
        'DistributionChannel',
        ''
      );
      oCustomerTax_Data.Division = _.get(
        oCustomer_SalesArea_Tax_BP,
        'Division',
        ''
      );
      oCustomerTax_Data.DepartureCountry = _.get(
        oCustomer_SalesArea_Tax_BP,
        'DepartureCountry',
        ''
      );
      oCustomerTax_Data.DepartureCountryName = _.get(
        oCustomer_SalesArea_Tax_BP,
        'DepartureCountryName',
        ''
      );
      oCustomerTax_Data.CustomerTaxCategory = _.get(
        oCustomer_SalesArea_Tax_BP,
        'CustomerTaxCategory',
        ''
      );
      oCustomerTax_Data.CustomerTaxClassification = _.get(
        oCustomer_SalesArea_Tax_BP,
        'CustomerTaxClassification',
        ''
      );
      oCustomerTax_Data.CustomerTaxClassificationName = _.get(
        oCustomer_SalesArea_Tax_BP,
        'CustomerTaxClassificationName',
        ''
      );

      if (!_.isEmpty(oCustomerTax_Data.CustomerTaxClassification)) {
        oCustomerTax_Data.CustomerTaxCategory = 'UTXJ';
      }

      //CustomerPartnerFunctions
      aCustomerPartnerFunctions_Data = _.map(
        aCustomer_SalesArea_PF_BP,
        function (oData) {
          return {
            IsDeleted: _.get(oData, 'IsDeleted', ''),
            IsExist:
              oData.PartnerFunction === 'SP'
                ? true
                : oData.PartnerFunction === 'BP'
                ? true
                : oData.PartnerFunction === 'PY'
                ? true
                : oData.PartnerFunction === 'SH'
                ? true
                : false,
            IsEdit: oData.PartnerFunction === 'SP' ? false : true,
            Customer: _.get(oData, 'Customer', ''),
            SalesOrganization: _.get(oData, 'SalesOrganization', ''),
            DistributionChannel: _.get(oData, 'DistributionChannel', ''),
            Division: _.get(oData, 'Division', ''),
            PartnerCounter: _.get(oData, 'PartnerCounter', ''),
            PartnerFunction: _.get(oData, 'PartnerFunction', ''),
            PartnerFunctionName: _.get(oData, 'PartnerFunctionName', ''),
            BPCustomerNumber: _.get(oData, 'BPCustomerNumber', ''),
            CustomerPartnerDescription: _.get(
              oData,
              'CustomerPartnerDescription',
              ''
            ),
            DefaultPartner: _.get(oData, 'DefaultPartner', false),
          };
        }
      );

      //Companycode
      if (sType === 'vendor') {
        oCompanycode_Data.Supplier = _.get(
          oSupplier_Company_BP,
          'Supplier',
          ''
        );
        oCompanycode_Data.Customer = '';
        oCompanycode_Data.CompanyCode = _.get(
          oSupplier_Company_BP,
          'CompanyCode',
          '1710'
        );
        oCompanycode_Data.ReconciliationAccount = _.get(
          oSupplier_Company_BP,
          'ReconciliationAccount',
          ''
        );
        oCompanycode_Data.PaymentTerms = _.get(
          oSupplier_Company_BP,
          'PaymentTerms',
          ''
        );
        oCompanycode_Data.PaymentTermsName = _.get(
          oSupplier_Company_BP,
          'PaymentTermsName',
          ''
        );
      } else {
        oCompanycode_Data.Supplier = '';
        oCompanycode_Data.Customer = _.get(
          oCustomer_Company_BP,
          'Customer',
          ''
        );
        oCompanycode_Data.CompanyCode = _.get(
          oCustomer_Company_BP,
          'CompanyCode',
          '1710'
        );
        oCompanycode_Data.ReconciliationAccount = _.get(
          oCustomer_Company_BP,
          'ReconciliationAccount',
          ''
        );
        oCompanycode_Data.PaymentTerms = _.get(
          oCustomer_Company_BP,
          'PaymentTerms',
          ''
        );
        oCompanycode_Data.PaymentTermsName = _.get(
          oCustomer_Company_BP,
          'PaymentTermsName',
          ''
        );
      }

      // Attchment
      aAttachment = _.map(aAttachment_BP, function (oAttachment) {
        return {
          filename: oAttachment.filename,
          filesize: oAttachment.filesize,
          filetype: oAttachment.filetype,
          fileID: oAttachment.fileID,
        };
      });

      return {
        ActiveBankAccount: bActiveBankAccount,
        ActivePurchasingOrganizations: bActivePurchasingOrganizations,
        ActiveSalesOrganizations: bActiveSalesOrganizations,
        GeneralData: oGeneral_Data,
        Roles: aRoles_Data,
        Address: oAddress_Data,
        StandardCommunication: oStandardCommunication_Data,
        BankAccount: oBankAccount_Data,
        PaymentTerms: oPaymentTerms_Data,
        TaxNumbers: oTaxNumbers_Data,
        PurchasingOrganizations: oPurchasingOrganizations_Data,
        SalesOrganizations: oSalesOrganizations_Data,
        CustomerTax: oCustomerTax_Data,
        CustomerPartnerFunctions: aCustomerPartnerFunctions_Data,
        Companycode: oCompanycode_Data,
        Attachment: aAttachment,
      };
    },

    checkEmail: function (sEmail) {
      if (_.isEmpty(sEmail)) {
        return true;
      }

      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(sEmail);
    },
  };
});
