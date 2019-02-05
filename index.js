const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const axios = require('axios');
const qs = require('qs')

class DropMail extends EventEmitter {
  /**
   * @param {string} domain 
   */
  constructor(domain) {
    super();

    this.address = null;
    this._socket = new WebSocket(`wss://dropmail.me/websocket`, {});
    this._setup(domain);
    this._readyEmitted = false;
    this._domainChanged = false;
  }

  /**
   * 
   * @param {*} to 
   * @param {*} locale 
   * @return {Promise<any>}
   */
  forward(to, locale = 'en') {
    if (!this.address) {
      Promise.reject(new Error('ERROR: "forward" called before readyState is OPEN, run "forward" inside one of this events: (ready, address)'));
    }

    return axios.post('https://dropmail.me/forwarding/create', qs.stringify({
      from: this.address.address,
      signature: this.address.hash,
      locale,
      to
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://dropmail.me',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((res) => {
      return res;
    }).catch((res) => res.response);
  }

  close() {
    this._socket.terminate();
  }

  _setup(domain) {
    this._socket.on('open', d => {
      this.emit('open', d);
      if (domain) {
        this._socket.send(`A${domain}`);
      }
    });
    this._socket.on('close', d => this.emit('close', d));
    this._socket.on('error', d => this.emit('error', d));
    this._socket.on('message', d => this.emit('message', d));
    this._socket.on('message', (msg) => {
      if (msg.charAt(0) === 'A') {
        let [address, hash] = msg.split(':');
        address = address.substr(1);
        this.address = new EmailAddress(address, hash, this._socket);

        if (domain && !this._domainChanged) {
          this._domainChanged = true;
        } else if (!this._readyEmitted) {
          this._readyEmitted = true;
          this.emit('address', this.address);
          this.emit('ready', this.address);
        }
      } else if (msg.charAt(0) === 'D') {
        let domains = msg.substr(1).split(',');
        this.emit('domains', domains);
      } else if (msg.charAt(0) === 'I') {
        let email = msg.substr(1);
        this.emit('email', JSON.parse(email));
      }
    });
  }
}


class EmailAddress {
  constructor(address, hash, client) {
    this.address = address;
    this.hash = hash;
    this.client = client;
  }

  toString() {
    return this.address;
  }

  json() {
    return {
      address: this.address,
      hash: this.hash,
      client: this.client
    }
  }
}

DropMail.EmailAddress = EmailAddress;

module.exports = DropMail;