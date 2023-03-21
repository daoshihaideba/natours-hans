const dotenv = require('dotenv');
const mongoose = require('mongoose');

// process.on('uncaughtException',err=> {
//   console.log(err.name,err.message)
//   console.log('UNCAUGHT EXCEPTION! Shutting down');
//   process.exit(1);

// })
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful');
  });

// console.log(process.env);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('UNHANDLER REJECTION! Shutting down');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. Shutting down gracefully');
  server.close(() => {
    console.log(' Process terminated!');
  });
});
