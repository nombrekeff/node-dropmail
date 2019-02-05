
<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/node-dropmail.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-dropmail

[code-quality-badge]: http://npm.packagequality.com/shield/node-dropmail.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=node-dropmail

[downloads-badge]: https://img.shields.io/npm/dm/node-dropmail.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/node-dropmail

[dependencies-badge]: https://img.shields.io/david/nombrekeff/node-dropmail.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/node-dropmail?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/node-dropmail/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/node-dropmail

# 📧 dropmail nodejs
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![](https://img.shields.io/bundlephobia/min/json-rpiecy.svg?style=flat-square)]()  
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]
[![NPM quality][code-quality-badge]][code-quality-link]


Temporal mail _using [dropmail.me](dropmail.me)_ for node that works _for now :p_

## What's it about
**DropMail** api for NodeJS, for generating random **temporal emails** and **reading the inbox**, you can also **forward emails** to other emails :)

> Internally it connects to `wss://dropmail.me/websocket` via websocket to get emails and listen for inwards emails

## Installing
Npm:
```
$ npm install dropmail
```


## Usage
### NodeJS
What better explanation that the real deal, here is what it can do:
```js
const DropMail = require('dropmail');

/** 
 * DropMail will create a temporal email for a random domain
 * or a specific one if you pass it in to the constructor
 */
let mail = new DropMail('10mail.org');

/**
 * Event for when mail is ready
 * you need to listen to this event or to 'address' event 
 * before you can make use of 'forward' and get the 'address' and 'hash'
 */
mail.on('ready', () => {
  /**
   * Forward all email to 'manoloedge96@gmail.com'
   * will send a confirmation email, can be in spam
   */
  mail.forward('manoloedge96@gmail.com')
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

/**
 * Event for when generated address is received
 */
mail.on('address', (address) => {
  console.log('Got address: (' + address.address + ') with hash: (' + address.hash + ').');
});

/**
 * Event for when list of domains is received
 */
mail.on('domains', (domains) => {
  console.log('Got domains:', domains);
});

/**
 * Event for when an email is received
 */
mail.on('email', (email) => {
  console.log('Got email:', email);
});

process.on('SIGINT', () => {
  /**
   * Close the mail, no longer will it be able to receive messages
   */
  mail.close();
});

```

### CLI
#### create
Create a temp email, and listen to inbox:
****
> ### `dropmail create [--domain <domain> --forward <email>]`
****

#### domains
List all available domains
****
> ### `dropmail domains`
****


## Api
### `DropMail`
This is the only thing you will use. 

**Signature**:
```ts
interface DropMail extends EventEmitter {
  address: EmailAddress;
  constructor(domain?: string): DropMail;
  forward(to: string, locale?: string): Promise<any>;
  close(): void;
  on(): void;
  once(): void;
  once(): void;
}
```

### `EmailAddress`
Email address little thingy:
```ts
interface EmailAddress {
  address: string;
  hash: string;
  client: ws.WebSocket;
  constructor(address, hash, client): EmailAddress;
  json(): Object;
}
```


