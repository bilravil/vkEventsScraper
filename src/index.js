const debug = require('debug')('scraper');
const config = require('./config');
const fs = require('fs');
const parse = require('csv-parse');

const Scraper = require('./scraper');
const Vk = require('./vk_api');

const CSV_FILE = '../groups.csv';

const result = {};

try {
  debug('Scraper started.');

  fs.readFile(CSV_FILE, (err, fileData) => {
    if (err) throw new Error(err);

    parse(fileData, {columns: true, trim: false}, async (err, urls) => {
      if (err) throw new Error(err);

      for (const url of urls) {
        if (url.url) {

          const ids = await Scraper.get(url.url);
          if (ids) {
            const vk = new Vk(config.VK_TOKEN);
            const {group, events} = await vk.getGroupById(ids);
            result[url.url] = {
              group,
              events
            };
            console.log(JSON.stringify(result));
          } else result[url.url] = {
            group: {},
            events: []
          }
        }
      }

      fs.writeFile('events.json', JSON.stringify(result), (err, data) => {
        if (err) throw new Error(error);
      });
    })
  })
} catch (error) {
  throw new Error(error);
}

function process(url) {

}
