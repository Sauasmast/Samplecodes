const refer = require(__base + '/app/modules/refer');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');
const bot = require(__base + '/app/modules/common/telegramBot');

const addModule = require(__base + '/app/modules/refer/add');
const utils = require(__base + '/app/modules/common/utils');
// const editModule = require(__base + '/app/modules/refer/edit');


module.exports.referpeople = async (req, res) => {
  try {
    const { emails } = req.body;
    const user_id = req.authInfo.user_id;
    const email = req.authInfo.tokenData.email;
    await refer.validation(req.request_id, emails[0]);
    await refer.checkuserconfiguration(req.request_id, user_id, emails.length);
    await refer.checkIfUserExist(req.request_id, emails);
    await refer.checkIfAlreadyReferred(req.request_id, user_id, emails);
    const codes = await refer.createcode(req.request_id, emails);
    await refer.databaseEntry(req.request_id, user_id, emails, codes);
    await refer.updatecount(req.request_id, user_id, emails.length);
    await refer.updateUserConfig(req.request_id, user_id, emails.length);
    bot.send(req.request_id, `Someone refered someone - ${req.request_id}`);
    await send_email.sendemail(req.request_id, email, emails, codes);
    response.success(req.request_id, {}, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};

module.exports.sendWebReferral = async (req, res) => {
  try {
    const { user_id } = req.authInfo;

    await addModule.init(req.request_id, req.body);
    const emails  = req.body.emails;
    const loggedInEmail = req.authInfo.tokenData.email;
    const payload = {
      user_id,
      loggedInEmail,
      refer_code: loggedInEmail.split('@')[0],
      emails
    }

    await addModule.ensureUserExists(req.request_id, payload);
    
    const responseBody = {
      success:[],
      error:[],
      hasError: false
    }
    let errorObj = {}

    // const email = req.authInfo.tokenData.email;
    // const refer_code = await addModule.createcode(req.request_id, payload);
    // payload.refer_code = refer_code;
    
    for(let referEmail of emails) {
      payload.referEmail = referEmail;
      responseBody.hasError = false;
      // await addModule.validation(req.request_id, payload);
      errorObj = await addModule.checkIfUserExist(req.request_id, payload);
      handleErrorChecking(errorObj, responseBody);
      if(!responseBody.hasError) {
        errorObj = await addModule.checkIfAlreadyReferredBySameUser(req.request_id, payload);
        handleErrorChecking(errorObj, responseBody);
      }

      if(!responseBody.hasError) {
        errorObj = await addModule.insertIntoReferralTable(req.request_id, payload);
        responseBody.success.push(referEmail);
      }
    }

    //get refer config that is set in database
    const user = await utils.getUserDetails(req.request_id, payload);
    payload.refer_code = user.refer_code;
    payload.user_type = user.type;

    const refer_config = await utils.getReferConfig(req.request_id, payload);

    const total_successful_referrals = responseBody.success.length;
    const total_points = refer_config.pending_points * total_successful_referrals;
    
    const dashboard_history = await utils.getDashboardHistory(req.request_id, payload);

    const updated_total_referred = dashboard_history.total_referred + total_successful_referrals;
    const updated_total_pending = dashboard_history.total_pending + total_successful_referrals;
    const updated_total_points = dashboard_history.points + total_points

    payload.total_referred = updated_total_referred;
    payload.total_pending = updated_total_pending;
    payload.points = updated_total_points;
    
    console.log(payload);

    await addModule.updateDashboardTable(req.request_id, payload);
    delete responseBody.hasError;
    bot.send(req.request_id, `Someone send a website referral - ${req.request_id}`);
    await send_email.sendemail(req.request_id, {email: loggedInEmail, emails: responseBody.success, refer_code: payload.refer_code });

    response.success(req.request_id, responseBody,  res);


  } catch (e) {
    response.failure(req.request_id, e, res);
  }
}


handleErrorChecking = (errorObj, response) => {
  if(errorObj) {
    response.error.push(errorObj);
    response.hasError = true;
  }
}

