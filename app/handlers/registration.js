'use strict';

const refer = require(__base + '/app/modules/refer');
const response = require(__base + '/app/modules/common/response');
const bot = require(__base + '/app/modules/common/telegramBot');
const send_email = require(__base + '/app/modules/common/ses_sendemail');

const addModule = require(__base + '/app/modules/registration/add');
const editModule = require(__base + '/app/modules/registration/edit');


module.exports.register = async (req, res) => {
  try {
    await addModule.init(req.request_id, req.body);
    const { email } = req.body;
    let payload = {
      email,
      refer_code: email.split('@')[0]
    }
    await addModule.validation(req.request_id, payload);
    await addModule.checkIfWebUserExist(req.request_id, payload);
    const {user_id, signup_token} = await addModule.insertIntoUsersTable(req.request_id, payload);
    payload.user_id = user_id;
    payload.signup_token = signup_token;

    // await addModule.insertintoReferConfigTable(req.request_id, payload);
    await addModule.insertIntoDashboardTable(req.request_id, payload);
    await addModule.insertIntoMarketingTable(req.request_id, payload);

    await send_email.sendHelloEmail(req.request_id, payload);
    bot.send(req.request_id, `Someone started registration - ${req.request_id}`);

    response.success(req.request_id, payload, res);

  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}

module.exports.finalizeRegistration = async (req, res) => {
  try {
    await editModule.init(req.request_id, req.body);

    const { email, password, signup_token, user_referred_by, user_id } = req.body;
    // const { id } = req.query;

    let payload = {
      email,
      user_id,
      password,
      signup_token,
      user_referred_by,
      refer_code: email.split('@')[0]
    }
    // await editModule.validation(req.request_id, payload);
    await editModule.authorizeSignupToken(req.request_id, payload)
    const hashedPassword = await editModule.hashPassword(req.request_id, payload);
    payload.password = hashedPassword;
    // await refer.sendWelcomeEmail(req.request_id, payload);

    await editModule.updateUsersTable(req.request_id, payload);
    await editModule.updateMarketingTable(req.request_id, payload);

    if(user_referred_by) {
      await editModule.verifyifUserReferredByExists(req.request_id, payload);
      await editModule.updateReferralTable(req.request_id, payload);
    }
    // await send_email.sendWelcomeEmail(req.request_id, payload);
    bot.send(req.request_id, `Someone finalized registration - ${req.request_id}`);

    response.success(req.request_id, {email: email, user_id }, res);

  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}


