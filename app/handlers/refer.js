const refer = require(__base + '/app/modules/refer');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');
const bot = require(__base + '/app/modules/common/telegramBot');

module.exports.referpeople = async (req, res) => {
  try {
    const { emails } = req.body;
    const user_id = req.authInfo.user_id;
    const email = req.authInfo.tokenData.email;
    await refer.checkuserconfiguration(req.request_id, user_id, emails.length);
    await refer.checkIfUserExist(req.request_id, emails);
    await refer.checkIfAlreadyReferred(req.request_id, user_id, emails);
    const codes = await refer.createcode(req.request_id, emails);
    await send_email.sendemail(req.request_id, email, emails, codes);
    await refer.databaseEntry(req.request_id, user_id, emails, codes);
    await refer.updatecount(req.request_id, user_id, emails.length);
    bot.send(req.request_id, `Someone refered someone - ${req.request_id}`);

    response.success(req.request_id, {}, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
