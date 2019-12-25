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
  const job = new CronJob('09 01 * * *', async function() {

    logger.info('Initiating daily cron job');

    const current_time = momentTZ().tz("America/New_York").format('YYYY-MM-DD');
    const req = { request_id: uuid() };

    const payload = {
      facebook_email_schedule: moment(current_time).subtract(3,'days').format("YYYY-MM-DD HH:MM:SS"),
      books_for_you_email_list: moment(current_time).subtract(7,'days').format("YYYY-MM-DD HH:MM:SS")
    }
    
    const facebook_email_list = await marketingInfoModule.getFacebookEmailList(req, payload);
    const books_for_you_email_list = await marketingInfoModule.getBooksforYouEmaillist(req, payload);

    if(facebook_email_list.length > 0) {
      //send facebook marketing email
      await notification.facebookCampaignEmails(req.request_id, {emails: facebook_email_list});
      facebook_email_list.forEach(async email => {
        await marketingEditModule.updateFacebookEmailList(req, {email});
      })
    }

    if(books_for_you_email_list.length > 0) {
      //send facebook marketing email
      await notification.booksForYouEmail(req.request_id, {emails: facebook_email_list});
      books_for_you_email_list.forEach(async email => {
        await marketingEditModule.updateBooksForYouEmailList(req, {email});
      })
    }

    

    logger.info('Ending background job');

  },  null, true, 'America/New_York');
  
  job.start();
}

const initReferReminder = () => {
  // const job = new CronJob('0 8,12,16,20 * * *', async function() {
  const job = new CronJob('00 08 * * *', async function() {

    logger.info('Initiating refer reminder daily cron job');
    bot.send(uuid(), `Inititing Refer Reminder cron job - ${uuid()}`);


    const current_time = momentTZ().tz("America/New_York").format('YYYY-MM-DD');
    const req = { request_id: uuid() };

    const payload = {
      day_1_reminder_email_schedule:  moment(current_time).subtract(1,'days').format("YYYY-MM-DD HH:MM:SS")
    }
    const refer_reminder_email_list = await  marketingInfoModule.getReferReminderEmailList(req, payload);
    refer_reminder_email_list.forEach(async l => {
      await notification.day1ReferReminderEmail(req.request_id, {email: l.refer_to_email, refer_code: l.refer_code});
      await marketingEditModule.updateReferReminderList(req, {refer_id:  l.refer_id})
    })

    logger.info('Ending background job');

  },  null, true, 'America/New_York');
  
  job.start();
}

// init();
initReferReminder()