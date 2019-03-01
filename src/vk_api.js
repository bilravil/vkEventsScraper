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
          fields: 'members_count',
          version: API_VERSION,
          access_token: this.access_token
        }
      }

      request.post(opts, (err, response) => {
        if (err) return reject(err);
        try {
          const body = JSON.parse(response.body).response;
          // Info about group is the beginning of response array;
          const group = body[0] || {};
          body.shift();

          const events = body;
          return resolve({group, events});
        } catch (error) {
          return resolve([]);
        }
      });
    })
  }
}

module.exports = Vk;