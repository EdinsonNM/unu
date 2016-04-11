
/**
 * Expose
 */

module.exports = {
  db: process.env.DATABASE||'mongodb://localhost/unu-development',
  port:process.env.PORT || 3000,
  key_secret: process.env.KEY_SECRET
};
