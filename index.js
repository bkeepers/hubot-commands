class HubotCommand {
  constructor(definition, action) {
    [this.name, ...this.args] = definition.split(/ +/);
    this.action = action;
  }

  get regex() {
    return new RegExp(`${this.name}(?: (.*))?`, 'i');
  }

  handler(res) {
    const args = (res.match[1] || '').split(/ +/);
    return this.action(res, ...args);
  }
}

module.exports = (robot) => {
  return {
    command(name, action) {
      const cmd = new HubotCommand(name, action);
      robot.respond(cmd.regex, cmd.handler.bind(cmd));
      return cmd;
    }
  }
}
