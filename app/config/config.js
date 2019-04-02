'use strict';

module.exports = {
  app: {
    port: process.env.PORT || 3006,
    environment: process.env.ENVIRONMENT || 'local'
  },
  mysql: {
    provisioning_db_host: process.env.MYSQL_PROVISIONING_DB_HOSTNAME,
    provisioning_db_port: process.env.MYSQL_PROVISIONING_DB_PORT,
    provisioning_db_username: process.env.MYSQL_PROVISIONING_DB_USERNAME,
    provisioning_db_password: process.env.MYSQL_PROVISIONING_DB_PASSWORD,
    provisioning_db_database: process.env.MYSQL_PROVISIONING_DB_DATABASE,

    promotion_db_host: process.env.MYSQL_PROMOTION_DB_HOSTNAME,
    promotion_db_port: process.env.MYSQL_PROMOTION_DB_PORT,
    promotion_db_username: process.env.MYSQL_PROMOTION_DB_USERNAME,
    promotion_db_password: process.env.MYSQL_PROMOTION_DB_PASSWORD,
    promotion_db_database: process.env.MYSQL_PROMOTION_DB_DATABASE,

    profile_db_host: process.env.MYSQL_PROFILE_DB_HOSTNAME,
    profile_db_port: process.env.MYSQL_PROFILE_DB_PORT,
    profile_db_username: process.env.MYSQL_PROFILE_DB_USERNAME,
    profile_db_password: process.env.MYSQL_PROFILE_DB_PASSWORD,
    profile_db_database: process.env.MYSQL_PROFILE_DB_DATABASE,

    max_conn_limit: process.env.MYSQL_MAX_CONN_LIMIT
  },
  aws: {
  },
  host: {
  },
  telegram: {
    bot: process.env.TELEGRAM_WEBHOOK_URL
  },
  jwt: {
    cert: process.env.JWT_TOKEN_CERT
  }
};
