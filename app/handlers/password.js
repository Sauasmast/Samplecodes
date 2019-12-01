'use strict';

const bot = require(__base + '/app/modules/common/telegramBot');
const utils = require(__base + '/app/modules/common/utils');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');

const editModule = require(__base + '/app/modules/password/edit');
const addModule = require(__base + '/app/modules/password/add');


module.exports.getCode = async (req, res) => {

  const { user_id} = req.authInfo;
  const { email } = req.body;
  try {
    await editModule.init(req.request_id, {user_id, email});
    const payload = {
      user_id, email
    }
    await editModule.validation(req.request_id, payload);
    const user = await editModule.checkIfUserExists(req.request_id, payload);

    let new_code = await utils.generateCode();
    payload.new_code = new_code;

    // payload.name = user.first_name
    
    //check if active password change code exists
    const codeExists = await editModule.checkIfAnyCodeExists(req.request_id, payload);
    if(codeExists) {
      //Soft delete all the previous code
      await editModule.softDelete(req.request_id, payload);
    }    
    await editModule.insertIntoRecoveryPassword(req.request_id, payload);
    await send_email.sendResetPasswordEmail(req.request_id, payload);
    bot.send(req.request_id, `Someone requested password change code - ${req.request_id}`);

    response.success(req.request_id, payload, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};

module.exports.validateCode = async (req, res) => {
  const { user_id } = req.authInfo;
  const { email, code } = req.body;

  try {
    const payload = { user_id, email, code};
    await editModule.validateCode(req.request_id, payload);
    let data = await editModule.checkIfCodeExists(req.request_id, payload);
    payload.created_at = data.created_at;
    payload.id = data.id;
    await editModule.checkExpiry(req.request_id, payload);

    response.success(req.request_id, {message: 'Password change code validated'}, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
}

module.exports.changePassword = async (req, res) => {
  try {
    const { user_id } = req.authInfo;
    req.body.user_id = user_id;
    await addModule.init(req.request_id, req.body);
    const { email, password, code } = req.body;
    const payload = {email, password, user_id, code}
    await addModule.validate(req.request_id, payload);
    await addModule.checkIfWebUserExist(req.request_id, payload);
    let data = await editModule.checkIfCodeExists(req.request_id, payload);
    payload.created_at = data.created_at;
    payload.id = data.id;

    await editModule.checkExpiry(req.request_id, payload);
    await editModule.softDelete(req.request_id, payload);
    await addModule.changePassword(req.request_id, payload);

    await send_email.sendPasswordChangedEmail(req.request_id, payload);

    bot.send(req.request_id, `Someone changed their password - ${req.request_id}`);

    response.success(req.request_id, {message: 'Password has been successfully changed'}, res);
  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}