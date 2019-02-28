const request = require('request');

const VK_API = 'https://api.vk.com/method/';
const API_VERSION = '5.92';

class Vk {
  constructor(access_token) {
    this.access_token = access_token;
  }
  getGroupById(group_ids) {
    return new Promise((resolve, reject) => {
      const opts = {
        method: 'GET',
        uri: VK_API + '/groups.getById',
        qs: {
          group_ids,
          fields: 'members_count, city',
          version: API_VERSION,
          access_token: this.access_token
        }
      }

      request.post(opts, (err, response, body) => {
        if (err)
          return reject(err);
        return resolve(body);
      });
    })
  }
}

module.exports = Vk;