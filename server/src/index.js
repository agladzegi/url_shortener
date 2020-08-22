const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port}`)
);
