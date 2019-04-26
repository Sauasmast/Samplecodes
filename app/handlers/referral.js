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
      await referral.createdata(req.request_id, req.authInfo.tokenData);
    }
  } catch (e) {
    res.send(e);
  }
};
