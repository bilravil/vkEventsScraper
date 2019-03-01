const Aigle = require('aigle');
const fs = require('fs');
const parse = require('csv-parse');

const Scraper = require('./scraper');
const Vk = require('./vk_api');

const CSV_FILE = '../groups.csv';
const RESULT_JSON = './events.json';

const VK_TOKEN = '8fc985b5f5ee97250340898ec6178b0675b867cafa93359dd201ed043e4c73d51aaf5e6bbcc275e030e45';

const result = {};

run();

/**
 * Read Vk urls from groups.csv file
 * @return {String} urls  Array of group's urls
 */
function getGroupUrls() {
  return new Promise((resolve, reject) => {
    fs.readFile(CSV_FILE, (err, fileData) => {
      if (err) return reject(err);

      parse(fileData, {columns: true, trim: false}, async (err, urls) => {
        if (err) return reject(err);
        return resolve(urls);
      });
    });
  })
}

/**
 * Write result to
 * @param {JSON}    result  All group's info in JSON
 */
function writeResultJson(result) {
  return new Promise((resolve, reject) => {
    fs.writeFile(RESULT_JSON, JSON.stringify(result), (err, data) => {
      if (err) return reject(err);
      console.log('Finish');
      return resolve();
    });
  });
}

async function run() {
  const urls = await getGroupUrls();
  Aigle.mapSeries(urls, process).then(
    async res => {await writeResultJson(result)},
    err => {throw new Error(err)}
  );
}

function process(url, index) {
  return Aigle.delay(0)
    .then(async () => {
      try {
        if (!result[url.url]) {
          const ids = await Scraper.get(url.url);
          if (ids) {
            const vk = new Vk(VK_TOKEN);
            const {group, events} = await vk.getGroupById(ids);
            result[url.url] = {
              group,
              events
            };
            console.log(JSON.stringify(result));
            return;
          } else result[url.url] = {
            group: {},
            events: []
          }
        } else return;
      } catch (error) {
        return Promise.reject(error);
      }
    });
}
