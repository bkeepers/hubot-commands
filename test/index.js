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
