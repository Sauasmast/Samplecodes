'use strict';

const referral = require(__base + '/app/modules/referral');

module.exports.getlink = async (req, res) => {
  try {
    const exist = await referral.checkUserTable(
      req.request_id,
      req.authInfo.user_id
    );
    if (exist) {
      res.send('User exists');
    } else {
      let createreferral = referral.createreferraldata(
        req.request_id,
        req.authInfo
      );
    }
  } catch (e) {
    res.send(e);
  }
};
