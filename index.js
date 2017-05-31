
class Command {
  constructor(definition, action) {
    const [name, ...args] = definition.split(/ +/);

    this.name = name;
    this.arguments = args.map(arg => new Argument(arg));
    this.action = action;
  }

  get regex() {
    return new RegExp(`${this.name}(?: (.*))?`, 'i');
  }

  handler(res) {
    const args = res.match[1] ? res.match[1].split(/ +/) : [];
    try {
      this.validateArgs(args);
      return this.action(res, ...args);
    } catch(error) {
      res.send(`error: ${error}`);
    }
  }

  validateArgs(args) {
    for(let i = 0; i < this.arguments.length; i++) {
      const arg = this.arguments[i];
      arg.validate(args[i]);
    }
  }

  description(str) {
    if (str === undefined) {
      return this._description;
    } else {
      this._description = str;
      return this;
    }
  }

  get help() {
    let help = `hubot ${this.name}`
    if(this.arguments.length)
      help += ' ' + this.arguments.map(arg => arg.help).join(' ');
    if(this._description)
      help += ` - ${this._description}`
    return help;
  }
}

class Argument {
  constructor(definition) {
    const match = definition.match(/^([\[<])?([^\]>]+)[\]>]?$/)
    this.name = match[2];
    this.required = match[1] == '<';
  }

  validate(arg) {
    if(this.required && null == arg) {
      throw `missing required argument \`${this.name}\``;
    }
  }

  get help() {
    return `${this.required ? '<' : '['}${this.name}${this.required ? '>' : ']'}`
  }
}

module.exports = (robot) => {
  const commands = [];

  function command(name, action) {
    const cmd = new Command(name, action);
    robot.respond(cmd.regex, cmd.handler.bind(cmd));
    commands.push(cmd)
    return cmd;
  }

  //
  command('help', (res) => {
    const help  = commands.map(cmd => cmd.help).filter(cmd => cmd);
    res.send(help.join('\n'));
  }).description('display help for available commands');

  return {command};
}
