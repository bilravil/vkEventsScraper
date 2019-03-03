const request = require('request');
const cheerio = require('cheerio');

let BAN_TIMEOUT = 1 * 60000; // 1 min timeout on the first BAN from Vk.
class Scraper {
  parseHtml(html) {
    let result = '';

    const $ = cheerio.load(html);
    const events = $('#public_events .line_cell.clear_fix');

    events.each((i, attr) => {
      let id = $(attr).attr('data-id');
      result += Math.abs(id) + ',';
    });
    return result;
  }

  get(url) {
    return new Promise(async (resolve, reject) => {

      const func = call.bind(this);
      await func();

      async function call() {

        const opts = {
          url,
          method: 'GET',
          gzip: true,
          Encoding: 'utf-8',
          headers: {
            'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-US; q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
          }
        };

        request(opts, async (err, resp, body) => {
          if (err || resp.statusCode >= 400) {
            BAN_TIMEOUT *= 2;
            console.log('TIMEOUT ERROR. Repeat request through', BAN_TIMEOUT / 60000, 'min');
            return setTimeout(call.bind(this), BAN_TIMEOUT);
          }

          let ids = url.split('https://vk.com/')[1] + ',';
          ids += this.parseHtml(resp.body);
          return resolve(ids);

        })
      }
    });
  }
}

module.exports = new Scraper();

