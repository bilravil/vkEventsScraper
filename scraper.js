const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

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
    return new Promise((resolve, reject) => {
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
          if (!err) err = new Error(`HTTP Error ${resp.statusCode}`);
          err.opts = opts;
          err.body = body;
          try {
            err.body = JSON.parse(err.body);
          } catch (e) {true;}
          return reject(err);
        }
        fs.writeFileSync('vk.html', resp.body)
        const ids = this.parseHtml(resp.body);
        return resolve(ids);
      });
    })
  }
}

module.exports = new Scraper();