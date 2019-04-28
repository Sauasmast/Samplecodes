'use strict';

const referral = require(__base + '/app/modules/referral');
const response = require(__base + '/app/modules/common/response');

module.exports.getdata = async (req, res) => {
  const user_id = req.authInfo.user_id;
  try {
    const exist = await referral.checkUserTable(req.request_id, user_id);
    const {
      type,
      max_referral_count,
      default_count
    } = await referral.userConfigdata(req.request_id, user_id);
    const { active, users_referred } = await referral.userreferreddata(
      req.request_id,
      user_id
    );
    const response_body = {
      type,
      max_referral_count,
      default_count,
      active,
      users_referred
    };
    response.success(req.request_id, response_body, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
