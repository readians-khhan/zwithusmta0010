const _ = require("lodash");

module.exports = {
    IsNotValid(oData) {
        if (_.isNull(oData) || oData === "" || _.isUndefined(oData) || _.isNaN(oData) || _.isNil(oData) || _.isEmpty(oData) || _.is)
            return true;
        else false;
    }
}