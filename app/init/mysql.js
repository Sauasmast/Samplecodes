'use strict';

const mysql = require('mysql');
const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

const provisioning = config.mysql.provisioning_db_database;
const promotion = config.mysql.promotion_db_database;
const profile = config.mysql.profile_db_database;
const query = 'SELECT 1+1;'

/** Provisioning DB **/

const provisioningDBPool = mysql.createPool({
  host: config.mysql.provisioning_db_host,
  port: config.mysql.provisioning_db_port,
  user: config.mysql.provisioning_db_username,
  password: config.mysql.provisioning_db_password,
  database: config.mysql.provisioning_db_database,
  connectionLimit: parseInt(config.mysql.max_conn_limit),
  multipleStatements: true,
  waitForConnections: true,
  dateStrings: true,
  acquireTimeout: 30000
});

logger.info(`Database initialized - host: ${config.mysql.provisioning_db_host} database: ${config.mysql.provisioning_db_database} max-pool-conn: ${config.mysql.max_conn_limit}.`)

module.exports.getprovisioningDBPool = () => {
  return provisioningDBPool;
};

provisioningDBPool.on('enqueue', (connection) => {
  logger.trace(`provisioningDBPool: Connection: Waiting.`);
});

initConn(provisioning, this.getprovisioningDBPool());

/** End Provisioning DB **/


/** Promotion DB **/

const promotionDBPool = mysql.createPool({
  host: config.mysql.promotion_db_host,
  port: config.mysql.promotion_db_port,
  user: config.mysql.promotion_db_username,
  password: config.mysql.promotion_db_password,
  database: config.mysql.promotion_db_database,
  connectionLimit: parseInt(config.mysql.max_conn_limit),
  multipleStatements: true,
  waitForConnections: true,
  dateStrings: true,
  acquireTimeout: 30000
});

logger.info(`Database initialized - host: ${config.mysql.promotion_db_host} database: ${config.mysql.promotion_db_database} max-pool-conn: ${config.mysql.max_conn_limit}.`)

module.exports.getpromotionDBPool = () => {
  return promotionDBPool;
};

promotionDBPool.on('enqueue', (connection) => {
  logger.trace(`promotionDBPool: Connection: Waiting.`);
});

initConn(promotion, this.getpromotionDBPool());

/** End Promotions DB **/

/** Profile DB **/

const profileDBPool = mysql.createPool({
  host: config.mysql.profile_db_host,
  port: config.mysql.profile_db_port,
  user: config.mysql.profile_db_username,
  password: config.mysql.profile_db_password,
  database: config.mysql.profile_db_database,
  connectionLimit: parseInt(config.mysql.max_conn_limit),
  multipleStatements: true,
  waitForConnections: true,
  dateStrings: true,
  acquireTimeout: 30000
});

logger.info(`Database initialized - host: ${config.mysql.profile_db_host} database: ${config.mysql.profile_db_database} max-pool-conn: ${config.mysql.max_conn_limit}.`)

module.exports.getprofileDBPool = () => {
  return profileDBPool;
};

profileDBPool.on('enqueue', (connection) => {
  logger.trace(`profileDBPool: Connection: Waiting.`);
});

initConn(profile, this.getprofileDBPool());

/** End Profile DB **/

function initConn(name, pool) {
  pool.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      logger.error(`${name}: Error in connection: ${JSON.stringify(err)}`);
    } else {
      const sql = mysql.format(query, []);
      connection.query(sql, function (error, results) {
        connection.release();
        if (error) 
          logger.error(`${name}: Error in connection: ${JSON.stringify(err)}`);
      });
    }

    connection.on('error', function(err) {
      logger.error(JSON.stringify(err));
    });
  });
}