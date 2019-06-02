const del = require(__base + '/app/modules/sendrefer/delete');
const response = require(__base + '/app/modules/common/response');
const bot = require(__base + '/app/modules/common/telegramBot');

module.exports.deleterefer = async (req, res) => {
  const { email } = req.body;
  const user_id = req.authInfo.user_id;
  try {
    const result = await del.checkIfReferred(req.request_id, user_id, email);
    await del.updateSoftDelete(req.request_id, result.id);
    await del.updateCount(req.request_id, user_id);
    await del.updateUserConfig(req.request_id, user_id);
    bot.send(
      req.request_id,
      `Someone deleted the referral - ${req.request_id}`
    );
    response.success(
      req.request_id,
      { message: 'Your refer service has been sucessfully deleted' },
      res
    );
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
