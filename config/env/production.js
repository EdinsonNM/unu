
/**
 * Expose
 */

module.exports = {
  db: process.env.MONGOLAB_URI||'mongodb://localhost/unu-production',
  port: process.env.PORT || 8082,
  key_secret:process.env.KEY_SECRET || '{unu2015}',
};
