const del = require(__base + '/app/modules/sendrefer/delete');
const response = require(__base + '/app/modules/common/response');
const send_email = require(__base + '/app/modules/common/ses_sendemail');

module.exports.sendagain = async (req, res) => {
  let resend_emails = Array();
  const email = req.authInfo.tokenData.email;
  const user_id = req.authInfo.user_id;
  let codes = [];
  resend_emails.push(req.query.email);
  try {
    console.log(resend_emails[0]);
    const result = await del.checkIfReferred(
      req.request_id,
      user_id,
      resend_emails[0]
    );
    codes.push(result[0].code);
    await send_email.sendemail(
      req.request_id,
      email,
      [...resend_emails],
      [...codes]
    );
    response.success(
      req.request_id,
      { message: 'Sucessfully resend the referral' },
      res
    );
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
