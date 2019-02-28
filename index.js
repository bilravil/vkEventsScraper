const express = require('express');
const debug = require('debug')('scraper');
const config = require('./config');

const Scraper = require('./scraper');
const Vk = require('./vk_api');

const PORT = config.PORT || 10001;
const app = express();

app.get('/', async (req, res) => {
  const url = config.VK_IDS[0];
  try {
    const result = await Scraper.get(url);
    res.status(200).end();
  } catch (error) {
    res.status(500).end(error.message);
    throw new Error(error);
  }
});

app.listen(PORT, async () => {
  debug(`VkEventsScraper started on ${PORT} port`);
  const url = config.VK_IDS[0];
  try {
    const ids = await Scraper.get(url);
    const vk = new Vk(config.VK_TOKEN);
    const res = await vk.getGroupById(ids);
    console.log(res);

  } catch (error) {
    throw new Error(error);
  }
});