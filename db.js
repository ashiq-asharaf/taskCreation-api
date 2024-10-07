const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://Check:Check890@localhost:5432/task",
});

pool.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error', err.stack);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
