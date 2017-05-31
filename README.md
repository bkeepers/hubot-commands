# Hubot Commands

This is a prototype for the Hubot [commands proposal](https://github.com/hubotio/evolution/pull/2).

```js
module.exports = robot => {
  const cli = require('hubot-commands')(robot)

  cli.command('cowsay <words...>', (res, words) => {
    res.send(require('cowsay').say(words.join(' ')))
  })
  .description('make the cow say words')
  .alias('c')
}
```

TODO:

- [ ] explicit args
  - [x] required: `deploy <branch>`
  - [x] optional: `deploy <branch> [environment]`
  - [ ] Variadic: `deploy <branch> [hosts...]`
  - [ ] coercion & regex for advanced syntax
  - [ ] default values
- [ ] subcommands: `deploy list`
- [x] alias
- [x] automated help
- [ ] listener metadata
