const _ = require("lodash");

module.exports = {
    IsNotValid(oData) {
        if (_.isNull(oData) || oData === "" || _.isUndefined(oData) || _.isNaN(oData) || _.isNil(oData))
            return true;
        else false;
    }
}