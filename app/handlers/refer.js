const refer = require(__base + '/app/modules/refer');

module.exports.referpeople = async (req, res) => {
  try {
    const { emails } = req.body;
    const codes = await refer.createcode(req.request_id, emails);
    const addIntoDatabase = await refer.databaseEntry(
      req.request_id,
      req.authInfo.user_id,
      emails,
      codes
    );
    console.log('Resolved');
    const count = await refer.updatecount(
      req.request_id,
      req.authInfo.user_id,
      emails.length
    );
    // resolve({ status: 200, message: 'All of the users were referred' });
  } catch (e) {
    console.log(e);
    reject(e);
  }
};
