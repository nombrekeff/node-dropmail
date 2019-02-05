const DropMail = require('../index');
const chalk = require('chalk');
const yargs = require('yargs');

const pkg = require('../package.json');

const args = yargs
  .version(pkg.version)
  .help('h')
  .option('version', {
    alias: 'v',
    description: 'Show version'
  })
  .option('help', {
    alias: 'h',
    description: 'Show help'
  })
  .command({
    command: 'create',
    description: 'Creates and listens for inwards messages',
    builder(yargs) {
      yargs.option('domain', {
        alias: 'd',
        description: 'Use this domain',
        type: 'string'
      }).option('forward', {
        alias: 'f',
        description: 'Forward to address',
        type: 'string'
      });
    },
    handler(cmd) {
      let mail = new DropMail(cmd.domain);
      mail.on('ready', () => {
        console.log('Created address: (' + chalk.blue(mail.address) + ') with hash: (' + chalk.keyword('gray')(mail.address.hash) + ').');

        if (cmd.forward) {
          mail.forward(cmd.forward)
            .then(resp => {
              console.log(`Forwarding [${chalk.cyan(mail.address)} -> ${chalk.blue(cmd.forward)}] \n - Sent a verification email to ${chalk.blue(cmd.forward)} (${chalk.keyword('gray')('check spam')})`);
              console.log('Listening for emails...');
            });
        } else {
          console.log('Listening for emails...');
        }
      });

      mail.on('email', (email) => {
        console.log('Got email:', email);
      });
    }
  })
  .command({
    command: 'domains',
    description: 'List all domains',
    handler(cmd) {
      let mail = new DropMail(cmd.domain);
      mail.on('domains', (domains) => {
        console.log('List of domains:');
        for (let domain of domains) {
          console.log(` ${chalk.keyword('gray')('>')} ${chalk.cyan(domain)}`);
        }
        mail.close();
      });
    }
  })
  .demandCommand()
  .help()
  .wrap(72)
  .argv;