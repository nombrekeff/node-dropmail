# 📧 dropmail nodejs
Temporal mail for node that works _for now :p_

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
interface DropMail {
  address: Address;
  constructor(domain?: string): DropMail;
  forward(to: string, locale?: string): Promise<any>;
  close(): void;
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


