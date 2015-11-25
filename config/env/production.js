
/**
 * Expose
 */

module.exports = {
  db: process.env.MONGOLAB_URI,
  port: process.env.PORT || 80,
  key_secret:process.env.KEY_SECRET || '{unu2015}',
};
