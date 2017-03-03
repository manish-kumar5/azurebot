var Promise = require('bluebird');
var policydata = require('./policy.json');
var beneficiarydata = require('./beneficiary.json');
var changehistorydata = require('./changehistory.json');

module.exports = {
    searchPolicy: function (certnumber) {
        return new Promise(function (resolve) {

            var _policy;
            for (var i = 0, l = policydata.policies.length; i < l; i++){
                var obj = policydata.policies[i];
                if (obj.certno === certnumber) {
                    _policy = obj;
                    break;
                }
            }


            // complete promise with a timer to simulate async response
            setTimeout(() => resolve(_policy), 1000);
        });
    },
    searchBeneficiary: function (certnumber) {
        return new Promise(function (resolve) {

            var _beneficiary;
            for (var i = 0, l = beneficiarydata.beneficiaries.length; i < l; i++){
                var obj = beneficiarydata.beneficiaries[i];
                if (obj.certno === certnumber) {
                    _beneficiary = obj;
                    break;
                }
            }


            // complete promise with a timer to simulate async response
            setTimeout(() => resolve(_beneficiary), 1000);
        });
    },

    searchChangehistory: function (certnumber) {
        return new Promise(function (resolve) {

            var _changehistory;
            for (var i = 0, l = changehistorydata.changehistory.length; i < l; i++){
                var obj = changehistorydata.changehistory[i];
                if (obj.certno === certnumber) {
                    _changehistory = obj;
                    break;
                }
            }
            // complete promise with a timer to simulate async response
            setTimeout(() => resolve(_changehistory), 1000);
        });
    }
};