'use strict';

const moment = require('moment');
const momentTZ = require('moment-timezone');
const uuid = require('uuid/v4');
const CronJob = require('cron').CronJob;
const bot = require(__base + '/app/modules/common/telegramBot');

const logger = require(__base + '/app/modules/common/logger');

const marketingInfoModule = require(__base + '/app/modules/marketing/info');
const marketingEditModule = require(__base + '/app/modules/marketing/edit');

const notification = require(__base + '/app/modules/secondary_services/notification');

const init = () => {
  // const job = new CronJob('0 8,12,16,20 * * *', async function() {
  const job = new CronJob('* * * * * * *', async function() {

    logger.info('Initiating daily cron job');

    const current_time = momentTZ().tz("America/New_York").format('YYYY-MM-DD');
    const req = { request_id: uuid() };

    const payload = {
      facebook_email_schedule: moment(current_time).subtract(3,'days').format("YYYY-MM-DD HH:MM:SS")
    }
    
    const facebook_email_list = await marketingInfoModule.getFacebookEmailList(req, payload);
    

    if(facebook_email_list.length > 0) {
      //send facebook marketing email
      await notification.facebookCampaignEmails(req.request_id, {emails: facebook_email_list});
      facebook_email_list.forEach(async email => {
        await marketingEditModule.updateFacebookEmailList(req, {email});
      })

    }

    logger.info('Ending background job');

  },  null, true, 'America/New_York');
  
  job.start();
}

init();