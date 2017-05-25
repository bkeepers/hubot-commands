// loading hubot fails without coffeescript
require("coffee-script");

const expect = require('expect');
const commands = require('..');
const Helper = require('hubot-test-helper');

const helper = new Helper([]);

describe('hubot-commands', () => {
  let cli;
  let room;

  beforeEach(function() {
    room = helper.createRoom();
    cli = commands(room.robot);
  });

  afterEach(function() {
    room.destroy();
  });

  it('registers the command', async () => {
    cli.command('test', res => res.send('hello world'));

    await room.user.say('alice', '@hubot test');

    expect(room.messages).toEqual([
      ['alice', '@hubot test'],
      ['hubot', 'hello world']
    ]);
  });

  it('registers the command with arguments', async () => {
    cli.command('hello <name>', res => {
      res.send(`${res.args.name}, ${res.envelope.user.name} says hello`);
    });

    await room.user.say('alice', 'hubot hello bob');

    expect(room.messages).toEqual([
      ['alice', '@hubot hello bob'],
      ['hubot', 'bob, alice says hello']
    ]);
  });
});
