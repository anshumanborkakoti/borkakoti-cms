const mongoose = require("mongoose");
const utils = require('./utils');

/**
 * dev conn  "mongodb+srv://tljneapiWrite:ecwdYReVNQcLEfCY@tljne-cluster-rcd2n.mongodb.net/tljnetransactionaldev?retryWrites=true&w=majority"
 * prod conn  "mongodb+srv://tljneapiWrite:ecwdYReVNQcLEfCY@tljne-cluster-rcd2n.mongodb.net/tljnetransactionalprod?retryWrites=true&w=majority"
 */

const transactional = async () => {
  let conn = null;
  try {
    conn = await mongoose
      .createConnection(
        process.env.DB_TRANS_CONN_STRING,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useCreateIndex: true
        }
      )
    utils.logInfo("[Transaction.Connection] Connected to transactional connection");
  } catch (e) {
    utils.logError("[Transaction.Connection] Cannot create connection", e);
  }
  return conn;
}
module.exports = transactional();
