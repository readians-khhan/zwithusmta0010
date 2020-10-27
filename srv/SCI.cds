using {SCI_API.sap.hci.api as SCI} from './external/SCI_API.csn';

@path : 'sci'
service SCIService {

    @readonly
    entity IntegrationRuntimeArtifacts as projection on SCI.IntegrationRuntimeArtifacts {
        Id, Version, Name, Type, DeployedBy, DeployedOn, Status
    };

    entity MessageProcessingErrorLogs  as select from SCI.MessageProcessingLogs {
        MessageGuid, 
        LogStart, 
        LogEnd, 
        Status, 
        IntegrationArtifact.Id as IntegrationArtifact_Id, 
        IntegrationArtifact.Name as IntegrationArtifact_Name, 
        IntegrationArtifact.Type as IntegrationArtifact_Type, 
        CustomStatus
    };

    @readonly
    entity MessageProcessingLogs       as projection on SCI.MessageProcessingLogs {
        MessageGuid, 
        LogStart, 
        LogEnd, 
        Status, 
        IntegrationArtifact.Id as IntegrationArtifact_Id, 
        IntegrationArtifact.Name as IntegrationArtifact_Name, 
        IntegrationArtifact.Type as IntegrationArtifact_Type, 
        CustomStatus
    }
}
