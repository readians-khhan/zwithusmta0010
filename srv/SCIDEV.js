const cds = require('@sap/cds');
const _ = require('lodash');

module.exports = cds.service.impl(async function() {
	const service = await cds.connect.to('SCIDEV.sap.hci.api');
	
	const { IntegrationPackages } = this.entities;	
	
	this.on('READ', IntegrationPackages, async request => {
		const response = await service.get('/IntegrationPackages')
		
		let data = _.map(response.d.results, (oData)=>{
			return _.pick(oData, ['Id','Name', 'Description'])
		})
		
		return data;
	});
});