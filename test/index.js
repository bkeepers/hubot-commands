// loading hubot fails without coffeescript
require('coffee-script')

const expect = require('expect')
const commands = require('..')
const Helper = require('hubot-test-helper')

const helper = new Helper([])

describe('.command', () => {
  let cli
  let room

  beforeEach(function () {
    room = helper.createRoom()
    cli = commands(room.robot)
  })

  afterEach(function () {
    room.destroy()
  })

  it('registers the command', async () => {
    cli.command('test', res => res.send('hello world'))

    await room.user.say('alice', '@hubot test')

    expect(room.messages).toEqual([
      ['alice', '@hubot test'],
      ['hubot', 'hello world']
    ])
  })

  describe('help', () => {
    it('adds the description to help', async () => {
      cli.command('test <arg>', res => { })
        .description('a description of the command')

      await room.user.say('alice', '@hubot help')

      expect(room.messages).toEqual([
        ['alice', '@hubot help'],
        ['hubot', [
          'hubot help - display help for available commands',
          'hubot test <arg> - a description of the command'
        ].join('\n')]
      ])
    })

    it('shows undocumented commands in help', async () => {
      cli.command('test <arg>', res => { })

      await room.user.say('alice', '@hubot help')

      expect(room.messages).toEqual([
        ['alice', '@hubot help'],
        ['hubot', [
          'hubot help - display help for available commands',
          'hubot test <arg>'
        ].join('\n')]
      ])
    })
  })

  describe('with required arguments', () => {
    beforeEach(() => {
      cli.command('hello <name>', (res, name) => {
        res.send(`${name}, ${res.envelope.user.name} says hello`)
      })
    })

    it('passes arguments to callback', async () => {
      await room.user.say('alice', '@hubot hello bob')

      expect(room.messages).toEqual([
        ['alice', '@hubot hello bob'],
        ['hubot', 'bob, alice says hello']
      ])
    })

    it('returns an error when missing required arguments', async () => {
      await room.user.say('alice', '@hubot hello')

      expect(room.messages).toEqual([
        ['alice', '@hubot hello'],
        ['hubot', 'error: missing required argument `name`']
      ])
    })
  })

  describe('with optional arguments', () => {
    beforeEach(() => {
      cli.command('goodbye [name]', (res, name) => {
        res.send(`goodbye ${name || 'world'}`)
      })
    })

    it('passes arguments to callback', async () => {
      await room.user.say('alice', '@hubot goodbye bob')

      expect(room.messages).toEqual([
        ['alice', '@hubot goodbye bob'],
        ['hubot', 'goodbye bob']
      ])
    })

    it('does not return an error when optional arguments', async () => {
      await room.user.say('alice', '@hubot goodbye')

      expect(room.messages).toEqual([
        ['alice', '@hubot goodbye'],
        ['hubot', 'goodbye world']
      ])
    })
  })

  describe('alias', () => {
    beforeEach(() => {
      cli.command('hello', res => res.send('hello world')).alias('hi')
    })

    it('invokes command by alias', async () => {
      await room.user.say('alice', '@hubot hi')

      expect(room.messages).toEqual([
        ['alice', '@hubot hi'],
        ['hubot', 'hello world']
      ])
    })

    it('does not invoke command with mismatched alias', async () => {
      await room.user.say('alice', '@hubot hip')

      expect(room.messages).toEqual([
        ['alice', '@hubot hip']
      ])
    })
  })
})
