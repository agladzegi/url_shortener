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

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.json({ message: 'hello 👍' });
});

app.get('/:id', async (req, res) => {
  const { id: slug } = req.params;

  try {
    const url = await urls.findOne({ slug });

    if (url) {
      return res.redirect(url.url);
    }

    res.redirect(`/?error=${slug} not found`);
  } catch (error) {
    res.redirect(`/?error=Link not found`);
  }
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
    res.status(400);
    next(new Error('ლინკი უნდა იწყებოდეს http:// ან https://'));
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
