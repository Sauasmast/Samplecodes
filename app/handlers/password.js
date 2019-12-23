'use strict';

const bot = require(__base + '/app/modules/common/telegramBot');
const utils = require(__base + '/app/modules/common/utils');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');

const editModule = require(__base + '/app/modules/password/edit');
const addModule = require(__base + '/app/modules/password/add');
const infoModule = require(__base + '/app/modules/password/info');


module.exports.getUserDetails = async (req, res) => {
  try {
    await infoModule.init(req.request_id, req.query);
    await infoModule.validation(req.request_id, req.query);
    const { signup_token } = req.query;
    const payload = {signup_token}
    const user = await infoModule.getUserInfo(req.request_id, payload);
    payload.email = user.email;
    payload.status = user.status;
    payload.user_id = user.user_id;
    response.success(req.request_id, payload, res);

  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}

module.exports.getCode = async (req, res) => {

  // const { user_id} = req.authInfo;
  const { email } = req.body;
  try {
    await editModule.init(req.request_id, {email});
    await editModule.validation(req.request_id, {email});
    const user = await editModule.checkIfUserExists(req.request_id, {email});

    const payload = {
      user_id:user.user_id,
      email: user.email
    }

    let new_code = await utils.generatePasswordCode();
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
  // const { user_id } = req.authInfo;
  const { code } = req.query;

  try {
    await editModule.checkIfCodeIsProvided(req.request_id, {code})
    await editModule.validateCode(req.request_id, {code});
    let data = await editModule.checkIfCodeExists(req.request_id, {code});
    const payload = { email: data.email, code};

    payload.created_at = data.created_at;
    payload.id = data.id;
    await editModule.checkExpiry(req.request_id, payload);

    response.success(req.request_id, {email: data.email}, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
}

module.exports.changePassword = async (req, res) => {
  try {
    // const { user_id } = req.authInfo;
    // req.body.user_id = user_id;
    await addModule.init(req.request_id, req.body);
    const { password, code, email } = req.body;
    const payload = {email, password, code}
    await addModule.validate(req.request_id, payload);
    await addModule.checkIfWebUserExist(req.request_id, payload);
    let data = await editModule.checkIfCodeExists(req.request_id, payload);
    payload.created_at = data.created_at;
    payload.id = data.id;

    await editModule.checkExpiry(req.request_id, payload);
    await editModule.softDelete(req.request_id, payload);

    const hashedPassword = await editModule.hashPassword(req.request_id, payload);
    payload.password = hashedPassword;

    await addModule.changePassword(req.request_id, payload);

    await send_email.sendPasswordChangedEmail(req.request_id, payload);

    bot.send(req.request_id, `Someone changed their password - ${req.request_id}`);

    response.success(req.request_id, {message: 'Password has been successfully changed'}, res);
  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}

module.exports.directChangePassword = async (req, res) => {
  try {
    const { user_id } = req.authInfo;
    req.body.user_id = user_id;
    await addModule.initDirect(req.request_id, req.body);
    const { password, old_password } = req.body;

    const payload = {password, old_password, user_id, user_id}
    const user = await addModule.checkIfWebUserExistById(req.request_id, payload);
    payload.userPassword = user.password;
    payload.email = user.email;

    await addModule.validate(req.request_id, payload);
    await editModule.comparePassword(req.request_id, payload);


    const hashedPassword = await editModule.hashPassword(req.request_id, payload);
    payload.password = hashedPassword;

    await addModule.changePassword(req.request_id, payload);

    // await send_email.sendPasswordChangedEmail(req.request_id, payload);

    bot.send(req.request_id, `Someone changed their password - ${req.request_id}`);

    response.success(req.request_id, {message: 'Password has been successfully changed'}, res);
  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}


