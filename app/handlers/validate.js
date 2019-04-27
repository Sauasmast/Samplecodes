const validate = require(__base + '/app/modules/validate');
const referral = require(__base + '/app/modules/referral');
const uuidv4 = require('uuid/v4');

module.exports.checkReferralCode = async (req, res) => {
  const { code, signup_email } = req.body;
  try {
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
    const createData = await referral.createdata(req.request_id, data);
    await validate.activeUser(req.request_id, get_referring_user.id);
    await validate.updateActivateCount(
      req.request_id,
      get_referring_user.user_id
    );
    res.send({
      status: 200,
      message: { user_id: data.user_id }
    });
  } catch (e) {
    res.send(e);
  }
};
