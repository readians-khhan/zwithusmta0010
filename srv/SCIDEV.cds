using {SCI_API.sap.hci.api as SCI} from './external/SCI_API.csn';

@path : 'scidev'
service SCIDEVService {

    @readonly
    entity IntegrationRuntimeArtifacts as projection on SCI.IntegrationRuntimeArtifacts {
        Id, Version, Name, Type, DeployedBy, DeployedOn, Status
    };

}
