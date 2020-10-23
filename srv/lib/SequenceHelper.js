const _ = require("lodash");

module.exports = class SequenceHelper {
	constructor(options) {
		this.db = options.db;
		this.sequence = options.sequence;
		this.table = options.table;
		this.field = options.field || "ID";
	}

	getNextNumber() {
		
		return new Promise(async (resolve, reject) => {
			let iNextNumber = 0;
			switch (this.db.kind) {
				case "hana":
					this.db.run(`SELECT "${this.sequence}".NEXTVAL FROM DUMMY`)
						.then(result => {
							iNextNumber = result[0][`${this.sequence}.NEXTVAL`];
							resolve(iNextNumber);
						})
						.catch(error => {
							reject(error);
						});

					break;
				case "sql":
				case "sqlite":
					let aNextNumber = await this.db.run(`SELECT MAX("${this.field}") as nextNumber FROM "${this.table}"`);
					iNextNumber = aNextNumber[0].nextNumber;
					resolve(iNextNumber);
					break;
				default:
					reject(new Error(`Unsupported DB kind --> ${this.db.kind}`));
			}
		});
	}
};