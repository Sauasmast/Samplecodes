const response = require(__base + '/app/modules/common/response');
const bot = require(__base + '/app/modules/common/telegramBot');

const utils = require(__base + '/app/modules/common/utils');

const infoModule = require(__base + '/app/modules/dashboard/info');

module.exports.getDashboardInfo = async (req, res) => {
  try {
    const { user_id }  = req.authInfo;
    await infoModule.init(req.request_id, {user_id});
    await infoModule.validation(req.request_id, {user_id});

    const payload = {
      user_id,
      dashboardInfo: {}
    }
    const user = await infoModule.getUserDetails(req.request_id, payload);
    payload.refer_code = user.refer_code;
    payload.email = user.email;

    const dashboard = await infoModule.getDashboardDetails(req.request_id, payload);
    payload.dashboardInfo.points = dashboard.points;
    const total_users = await infoModule.getTotalUsers(req.request_id, payload);
    const referrals = await infoModule.getReferrals(req.request_id, payload);
    const rank = await infoModule.getUserRanking(req.request_id, payload)
    const completed = referrals.filter(r => r.status === 'active').length;

    payload.total_users_available = total_users;
    payload.dashboardInfo.total_invites = referrals.length;
    payload.dashboardInfo.total_users_accepted = completed;
    payload.dashboardInfo.referrals = referrals;
    payload.dashboardInfo.rank = rank

    response.success(req.request_id, payload,  res);


  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}