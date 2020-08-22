const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const yup = require('yup');
const { nanoid } = require('nanoid');
const monk = require('monk');

require('dotenv').config();
const middlewares = require('./middlewares/middlewares');

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.json({ message: 'hello 👍' });
});

app.get('/url/:id', (req, res) => {
  // Todo: get a short url by id
});

app.get('/:id', (req, res) => {
  // Todo: redirect to url
});

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
  const { url } = req.body;

  let slug = nanoid(5).toLowerCase();

  try {
    await schema.validate({ slug, url });

    const existing = await urls.findOne({ slug });

    if (existing) {
      slug = nanoid(5).toLowerCase();
    }

    const newUrl = {
      url,
      slug,
    };

    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
