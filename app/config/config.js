'use strict';

module.exports = {
  app: {
    port: process.env.PORT || 3004,
    environment: process.env.ENVIRONMENT || 'local'
  },
  mysql: {
    provisioning_db_host: process.env.MYSQL_PROVISIONING_DB_HOSTNAME,
    provisioning_db_port: process.env.MYSQL_PROVISIONING_DB_PORT,
    provisioning_db_username: process.env.MYSQL_PROVISIONING_DB_USERNAME,
    provisioning_db_password: process.env.MYSQL_PROVISIONING_DB_PASSWORD,
    provisioning_db_database: process.env.MYSQL_PROVISIONING_DB_DATABASE,

    max_conn_limit: process.env.MYSQL_MAX_CONN_LIMIT
  },
  aws: {
    s3: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    },
    ses: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION,
      version: process.env.AWS_API_VERSION
    }
  },
  email: {
    from: process.env.FROM_EMAIL
  },
  host: {},
  telegram: {
    bot: process.env.TELEGRAM_WEBHOOK_URL
  },
  jwt: {
    cert: process.env.JWT_TOKEN_CERT
  },
  sendgrid: {
    email_refer_template_id: process.env.EMAIL_REFER_TEMPLATE_ID,
    api_key: process.env.SENDGRID_API_KEY
  },
  telegram: {
    bot: process.env.TELEGRAM_WEBHOOK_URL
  }
};
