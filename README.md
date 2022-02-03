
<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/dropmail.svg?style=flat-square
[npm-url]: https://npmjs.org/package/dropmail

[code-quality-badge]: http://npm.packagequality.com/shield/dropmail.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=dropmail

[downloads-badge]: https://img.shields.io/npm/dm/dropmail.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/dropmail

[dependencies-badge]: https://img.shields.io/david/nombrekeff/node-dropmail.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/node-dropmail?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/dropmail/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/dropmail

# 📧 dropmail nodejs
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![](https://img.shields.io/bundlephobia/min/json-rpiecy.svg?style=flat-square)]()  
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]
[![NPM quality][code-quality-badge]][code-quality-link]


Temporal mail for node, that works _for now :p_  
> _using [dropmail.me](dropmail.me)_ 


## NOTICE
> I do not maintain this repo any more, if you use it please let me now and will be glad to help out :)

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
   * Forward all email to '<your_email>'
   * will send a confirmation email, can be in spam
   */
  mail.forward('<your_email>')
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

  // EventEmitter
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners(event: string | symbol): Function[];
  emit(event: string | symbol, ...args: any[]): boolean;
  eventNames(): Array<string | symbol>;
  listenerCount(type: string | symbol): number;
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


