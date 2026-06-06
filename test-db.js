const { Client } = require('pg');

const client = new Client({
  host: 'acela.proxy.rlwy.net',
  port: 10788,
  user: 'postgres',
  password: 'vCcanpcZUHKsQEXyrlZziXbLpIVIoVPZ',
  database: 'railway',
  ssl: { rejectUnauthorized: false },
});

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected successfully');
    client.end();
  }
});
