'use strict';
const logger = require(__base + '/app/modules/common/logger');
const response = require(__base + '/app/modules/common/response');
const utils = require(__base + '/app/modules/common/utils');

const addModule = require(__base + '/app/modules/referral/add');


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

module.exports.registerWithReferral = async (req, res) => {
  try {

    await addModule.init(req.request_id, req.body);
    const { email, refer_code } = req.body;
    let payload = {
      email,
      refer_code,
    }
    await addModule.validation(req.request_id, payload);
    await addModule.checkIfWebUserExist(req.request_id, payload);

    const user_referred_by = await addModule.getUserDetails(req.request_id, payload);
    payload.user_referred_by = user_referred_by.user_id;
    payload.user_type = user_referred_by.type;

    await addModule.checkIfReferCodeIsValid(req.request_id, payload);

    const user = await addModule.getDashboardDetails(req.request_id, payload);

    //send type of user who referred
    const refer_config = await utils.getReferConfigOfUserReferred(req.request_id, payload);


    payload.total_referred = user.total_referred;
    payload.total_activated = user.total_activated + 1;
    payload.total_pending = user.total_pending - 1;
    payload.total_points = user.points + refer_config.accepted_points;

    await addModule.updateDashboardTable(req.request_id, payload);
    await addModule.updateReferralTable(req.request_id, payload);

    // await refer.sendWelcomeEmail(req.request_id, payload);
    const {user_id, signup_token} = await addModule.insertIntoUsersTable(req.request_id, payload);
    payload.user_id = user_id;

    // await addModule.insertintoReferConfigTable(req.request_id, payload);
    await addModule.insertIntoDashboardTable(req.request_id, payload);

    payload.signup_token = signup_token;
    response.success(req.request_id, {user_id,signup_token,refer_code,user_referred_by}, res);

  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}
