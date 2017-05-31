const {TextMessage} = require('hubot')

class Command {
  constructor (definition, action) {
    const [name, ...args] = definition.split(/ +/)

    this._name = name
    this.arguments = args.map(arg => new Argument(arg))
    this.action = action
  }

  matches (name) {
    return name === this._name || name === this._alias
  }

  validateArgs (args) {
    for (let i = 0; i < this.arguments.length; i++) {
      const arg = this.arguments[i]
      arg.validate(args[i])
    }
  }

  description (str) {
    if (str === undefined) {
      return this._description
    } else {
      this._description = str
      return this
    }
  }

  alias (alias) {
    if (alias === undefined) {
      return this._alias
    } else {
      this._alias = alias
      return this
    }
  }

  get help () {
    let help = `hubot ${this._name}`
    if (this.arguments.length) { help += ' ' + this.arguments.map(arg => arg.help).join(' ') }
    if (this._description) { help += ` - ${this._description}` }
    return help
  }
}

class Argument {
  constructor (definition) {
    const match = definition.match(/^([[<])?([^\]>]+)[\]>]?$/)
    this._name = match[2]
    this.required = match[1] === '<'
  }

  validate (arg) {
    if (this.required && arg == null) {
      throw new Error(`missing required argument \`${this._name}\``)
    }
  }

  get help () {
    return `${this.required ? '<' : '['}${this._name}${this.required ? '>' : ']'}`
  }
}

module.exports = (robot) => {
  const commands = []
  const regex = robot.respondPattern(/(\w+)(?: (.*))?/)

  function listener (message) {
    if (message instanceof TextMessage) {
      const match = message.match(regex)
      if (match) {
        match.command = commands.find(cmd => cmd.matches(match[1]))
        if (match.command) {
          return match
        }
      }
    }
  }

  function handler (res) {
    const cmd = res.match.command
    const args = res.match[2] ? res.match[2].split(/ +/) : []
    try {
      cmd.validateArgs(args)
      return cmd.action(res, ...args)
    } catch (error) {
      res.send(`error: ${error.message}`)
    }
  }

  function command (name, action) {
    const cmd = new Command(name, action)
    commands.push(cmd)
    return cmd
  }

  robot.listen(listener, handler)

  command('help', (res) => {
    const help = commands.map(cmd => cmd.help).filter(cmd => cmd)
    res.send(help.join('\n'))
  }).description('display help for available commands')

  return {command}
}
