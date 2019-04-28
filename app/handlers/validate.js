const validate = require(__base + '/app/modules/validate');
const referral = require(__base + '/app/modules/referral');
const uuidv4 = require('uuid/v4');
const response = require(__base + '/app/modules/common/response');

module.exports.checkReferralCode = async (req, res) => {
  const { code, signup_email } = req.body;
  try {
    await validate.init(req.request_id, code);
    const get_referring_user = await validate.checkCodeEmail(
      req.request_id,
      code,
      signup_email
    );
    const data = {
      user_id: uuidv4(),
      reference_id: get_referring_user.id,
      referred_by_user_id: get_referring_user.user_id,
      email: signup_email
    };
    await referral.createdata(req.request_id, data);
    await validate.activeUser(req.request_id, get_referring_user.id);
    await validate.updateActivateCount(
      req.request_id,
      get_referring_user.user_id
    );
    await validate.makeUserConfig(req.request_id, data.user_id);
    response.success(req.request_id, { user_id: data.user_id }, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
