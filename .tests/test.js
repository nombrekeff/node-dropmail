const DropMail = require('../index');

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