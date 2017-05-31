// loading hubot fails without coffeescript
require("coffee-script");

const expect = require('expect');
const commands = require('..');
const Helper = require('hubot-test-helper');

const helper = new Helper([]);

describe('.command', () => {
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

  describe('with required arguments', () => {
    beforeEach(() => {
      cli.command('hello <name>', (res, name) => {
        res.send(`${name}, ${res.envelope.user.name} says hello`);
      });
    });

    it('passes arguments to callback', async () => {
      await room.user.say('alice', '@hubot hello bob');

      expect(room.messages).toEqual([
        ['alice', '@hubot hello bob'],
        ['hubot', 'bob, alice says hello']
      ]);
    });

    it('returns an error when missing required arguments', async () => {
      await room.user.say('alice', '@hubot hello');

      expect(room.messages).toEqual([
        ['alice', '@hubot hello'],
        ['hubot', 'error: missing required argument `name`']
      ]);
    });
  });

  describe('with optional arguments', () => {
    beforeEach(() => {
      cli.command('goodbye [name]', (res, name) => {
        res.send(`goodbye ${name || 'world'}`);
      });
    });

    it('passes arguments to callback', async () => {
      await room.user.say('alice', '@hubot goodbye bob');

      expect(room.messages).toEqual([
        ['alice', '@hubot goodbye bob'],
        ['hubot', 'goodbye bob']
      ]);
    });

    it('does not return an error when optional arguments', async () => {
      await room.user.say('alice', '@hubot goodbye');

      expect(room.messages).toEqual([
        ['alice', '@hubot goodbye'],
        ['hubot', 'goodbye world']
      ]);
    });
  });
});
