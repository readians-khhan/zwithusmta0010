const cds = require("@sap/cds");
const _ = require("lodash");

module.exports = cds.service.impl(async function () {
  const service = await cds.connect.to("SCI_API.sap.hci.api");

  const { IntegrationRuntimeArtifacts } = this.entities;

  this.on("READ", IntegrationRuntimeArtifacts, async (request) => {
    return service.tx(request).run(request.query);
    
    //const response = await service.get("/IntegrationRuntimeArtifacts");

    // let data = _.map(response.d.results, (oData) => {
    //   return _.pick(oData, [ "Id", "Version", "Name", "Type", "DeployedBy", "DeployedOn", "Status"]);
    // });

    //return data;
  });
});
