const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');
const sgMail = require('@sendgrid/mail');
const logger = require(__base + '/app/modules/common/logger');
const bot = require(__base + '/app/modules/common/telegramBot');

module.exports.sendAppReferEmail = (request_id, user_email, emails, codes) => {
	return new Promise(async (resolve, reject) => {
		try {
			const msg = {
				to: emails[0],
				from: config.email.from,
				templateId: config.sendgrid.app_refer_email_template_id,
				dynamic_template_data: {
					email: user_email,
					refer_code: codes[0].toString()
				}
			};

			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.send(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));
					resolve();
				}
			});
		} catch (e) {
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};

module.exports.sendemail = (request_id, payload) => {
	return new Promise(async (resolve, reject) => {
		logger.info('Sending a website referral email');
		try {
			const msg = {
				to: payload.toEmail,
				from: config.email.from,
				templateId: config.sendgrid.email_refer_template_id,
				dynamic_template_data: {
					email: payload.email,
					accept_invite_link: `${config.services.refer}/referral/${payload.toEmail}/${payload.refer_code}`
					// accept_invite_link: `https://hazelnut-web.herokuapp.com/referral/${payload.toEmail}/${payload.refer_code}`
				}
			};
			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.sendMultiple(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));
					bot.send(request_id, `Refer email sent - ${request_id}`);

					resolve();
				}
			});
		} catch (e) {
			console.log(e);
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};

module.exports.sendHelloEmail = (request_id, payload) => {
	return new Promise(async (resolve, reject) => {
		logger.info('sendHelloEmail');
		try {
			const msg = {
				to: payload.email,
				from: config.email.from,
				templateId: config.sendgrid.hello_email_template_id,
				dynamic_template_data: {
					email: payload.email,
					password_link: `${config.services.refer}/signup/${payload.signup_token}`,
					dashboard_link: `${config.services.refer}/dashboard`
					// dashboard_link: 'https://hazelnut-web.herokuapp.com/dashboard'
					// password_link: `https://hazelnut-web.herokuapp.com/signup/${payload.signup_token}`,
				}
			};
			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.sendMultiple(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));

					resolve();
				}
			});
		} catch (e) {
			console.log(e);
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};

module.exports.sendWelcomeEmail = (request_id, payload) => {
	return new Promise(async (resolve, reject) => {
		logger.info('Sending welcome email');
		try {
			const msg = {
				to: payload.email,
				from: config.email.from,
				templateId: config.sendgrid.welcome_email_template_id,
				dynamic_template_data: {
					email: payload.email,
					refer_link: `${config.services.refer}/${payload.refer_code}`,
					dashboard_link: `${config.services.refer}/dashboard`
					// refer_link: `https://hazelnut-web.herokuapp.com/${payload.refer_code}`,
					// dashboard_link: 'https://hazelnut-web.herokuapp.com/dashboard'
				}
			};
			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.sendMultiple(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));

					resolve();
				}
			});
		} catch (e) {
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};

module.exports.sendResetPasswordEmail = (request_id, payload) => {
	return new Promise(async (resolve, reject) => {
		logger.info('sendResetPasswordEmail');
		try {
			const msg = {
				to: payload.email,
				from: config.email.from,
				templateId: config.sendgrid.forgot_password_email_template_id,
				dynamic_template_data: {
					name: payload.name ? payload.name : '',
					reset_password_link: `${config.services.refer}/resetpassword/${payload.new_code}`
					// reset_password_link: `https://hazelnut-web.herokuapp.com/resetpassword/${payload.new_code}`
				}
			};
			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.sendMultiple(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));

					resolve();
				}
			});
		} catch (e) {
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};

module.exports.sendPasswordChangedEmail = (request_id, payload) => {
	return new Promise(async (resolve, reject) => {
		logger.info('sendPasswordChangedEmail');
		try {
			const msg = {
				to: payload.email,
				from: config.email.from,
				templateId: config.sendgrid.password_changed_email_template_id
				// dynamic_template_data: {
				//   name: payload.name ? payload.name : '',
				//   reset_password_link: `https://hazelnut-web.herokuapp.com/password/reset/${payload.new_code}`
				// }
			};
			sgMail.setApiKey(config.sendgrid.api_key);
			logger.debug(request_id, JSON.stringify(msg));

			sgMail.sendMultiple(msg, function(err, data) {
				console.log(err, null);
				if (err) {
					console.log('err', err);
					reject({
						code: 400,
						message: { message: err.message, stack: err.stack }
					});
				} else {
					logger.debug(request_id, JSON.stringify(data));

					resolve();
				}
			});
		} catch (e) {
			reject({ code: 400, message: { message: e.message, stack: e.stack } });
		}
	});
};
