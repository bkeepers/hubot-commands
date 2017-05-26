
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
}

module.exports = (robot) => {
  return {
    command(name, action) {
      const cmd = new Command(name, action);
      robot.respond(cmd.regex, cmd.handler.bind(cmd));
      return cmd;
    }
  }
}
