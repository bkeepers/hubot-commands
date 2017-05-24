const Command = require('commander').Command;

module.exports = (robot) => {
  return {
    command(name, action) {
      var cmd = new Command(name);
      robot.respond(new RegExp(`${cmd.name()}`, 'i'), action);
    }
  }
}
