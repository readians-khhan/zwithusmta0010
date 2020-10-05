using {SCIDEV.sap.hci.api as extSCIDEV} from './external/SCIDEV.csn';

@path : 'scidev'
service SCIDEVService {

    @readonly
    entity IntegrationPackages as projection on extSCIDEV.IntegrationPackages {
        Id, Name, Description
    };

}
