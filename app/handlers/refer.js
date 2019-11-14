const refer = require(__base + '/app/modules/refer');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');
const bot = require(__base + '/app/modules/common/telegramBot');

const addModule = require(__base + '/app/modules/refer/add');
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
    await addModule.init(req.request_id, req.body);
    const emails  = req.body.emails;
    const loggedInEmail = 'rashul1996@gmail.com';
    const user_id = '32459ac8-5793-41a9-80b1-06e82e11bad6';

    const payload = {
      user_id,
      loggedInEmail
    }

    const responseBody = {
      success:[],
      error:[],
      hasError: false
    }
    let errorObj = {}

    // const email = req.authInfo.tokenData.email;
    const refer_code = await addModule.createcode(req.request_id, payload);
    payload.refer_code = refer_code;
    
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
        // send_email.sendemail(req.request_id, email, emails, codes);
        bot.send(req.request_id, `Someone send a website referral - ${req.request_id}`);

      }

    }
    delete responseBody.hasError;
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

