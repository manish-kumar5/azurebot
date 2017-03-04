var Promise = require('bluebird');
var policydata = require('./policy.json');
var beneficiarydata = require('./beneficiary.json');
var changehistorydata = require('./changehistory.json');

module.exports = {
    validateCert: function(certnumber){
            var _policy;
            for (var i = 0, l = policydata.policies.length; i < l; i++){
                var obj = policydata.policies[i];
                if (obj.certno === certnumber) {
                    _policy = obj;
                    break;
                }
            }
            return _policy;
    },
    validateDOB: function (dob) {
            var _beneficiary;
            for (var i = 0, l = beneficiarydata.beneficiaries.length; i < l; i++){
                var obj = beneficiarydata.beneficiaries[i];
                if (obj.dob === dob) {
                    _beneficiary = obj;
                    break;
                }
            }
            return _beneficiary;
    },
    validatePhone: function (phone) {
            var _beneficiary;
            for (var i = 0, l = beneficiarydata.beneficiaries.length; i < l; i++){
                var obj = beneficiarydata.beneficiaries[i];
                if (obj.phone === phone) {
                    _beneficiary = obj;
                    break;
                }
            }
            return _beneficiary;
    },
    validateSSN: function (ssn) {
            var _beneficiary;
            for (var i = 0, l = beneficiarydata.beneficiaries.length; i < l; i++){
                var obj = beneficiarydata.beneficiaries[i];
                if (obj.ssn.substr(obj.ssn.length - 4) === ssn) {
                    _beneficiary = obj;
                    break;
                }
            }
            return _beneficiary;
    },
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