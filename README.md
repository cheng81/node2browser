# Node2Browser

Just a simple tool to port node modules to the browser.

## What it does

You code your project using the normal [Node](http://www.nodejs.org/) module structure, then feed the tool with the main file (typically `<project path>/lib/index.js` or similar). Node2browser figures out the dependency tree, by parseing calls to the `require` function, and then concatenates the modules in a single fat javascript file, in a way that all the dependencies of a module have been already loaded when the module is required.
Modules are loaded using [self-invoking anonimous functions](http://blog.themeforest.net/tutorials/ask-jw-decoding-self-invoking-anonymous-functions/).

## Features

`node2browser` simply figures out the dependency tree of your modules, then squash them into a single file.
The modules will then be available in the browser using the `window.node2browser.require` function, 
which works pretty the same way as Node's require.

Default modules:

  - `process`: has only one method, `nextTick` (simulated using `window.setTimeout`)
  - `util`:
     - `inspect`, just call `console.log`
     - `inherits`, stripped from [nodejs](http://www.nodejs.org/)

## Install and Usage

    git clone git://github.com/cheng81/node2browser.git
    cd node2browser
    bin/node2browser <initfile> <outfile> <nodemodulesdir>

`initfile` is tipically the `index.js` in your project. From there, the tool will figure out which file are
required where.

`outfile` is where the "compiled" javascript will be. Default is `dist/out.js`.

`nodemodulesdir` is where the node modules that you want to include will be.
Sorry, for now it's very stupid and only single-file modules can be used -it's sufficient for me, if you need more drop a request to frza-AT-itu-DOT-dk-.

A simple example is included the in `test` directory, which also uses the [wu](http://fitzgen.github.com/wu.js/) library. Try it out with

    bin/node2browser test/test1.js test/out.js test/node

After the execution the `test/out.js` file is produced, which includes `test1.js`, `test2.js` and `node/wu.js` modules. The file `test/index.html` uses the produced file, plus shows also how to use `node2browser` in the browser.

### In the Browser

To use the loaded modules in the browser, just use the `window.node2browser.require` function like you would use the Nodejs one, e.g.:

    var require = window.node2browser.require

    var mymod = require('./mymod')

By default `./mymod` will be resolved against the directory of the `initfile` above.

## Limitations

The grammar that extract the `require` calls is dumb. Specifically, it will:

 - consider valid a commented call
 - not recognize a call if you alias the `require` function (e.g. `var r = require; r('bla')` will not work)

Circular dependencies are not handled. The tool will stop with an exception when a circular dependency is found (and I am not sure if even node itself handle circular dependencies).

The parser has been built using the incredibly cool [PEGjs](http://pegjs.majda.cz/) peg parser.