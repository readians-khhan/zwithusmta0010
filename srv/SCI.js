const cds = require("@sap/cds");
const _ = require("lodash");

module.exports = cds.service.impl(async function () {
  const service = await cds.connect.to("SCI_API.sap.hci.api");

  const {
    IntegrationRuntimeArtifacts,
    MessageProcessingErrorLogs,
    MessageProcessingLogs,
  } = this.entities;

  this.on("READ", IntegrationRuntimeArtifacts, async (request) => {
    return service.tx(request).run(request.query);
  });

  this.on("READ", MessageProcessingErrorLogs, async (request) => {
    return service.tx(request).run(request.query);
  });

  this.on("READ", MessageProcessingLogs, async (request) => {
    var oQuery = request.query.SELECT.columns;
    delete oQuery[4];
    delete oQuery[5];
    delete oQuery[6];
    delete request.query.SELECT.orderBy;
    oQuery.push({ ref: ["IntegrationArtifact"] });

    var data = await service.tx(request).run(request.query);

    data = _.map(data, (oData) => {
      oData.IntegrationArtifact_Id = oData.IntegrationArtifact.ID;
      oData.IntegrationArtifact_Name = oData.IntegrationArtifact.Name;
      oData.IntegrationArtifact_Type = oData.IntegrationArtifact.Type;
      delete oData.IntegrationArtifact;
      oData.LogStart = new Date(oData.LogStart);
      return oData;
    });

    return data;
  });
});
