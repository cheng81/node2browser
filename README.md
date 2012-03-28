# Node2Browser

Just a simple tool to port node modules to the browser.

## Features

`node2browser` simply figures out the dependency tree of your modules, then squash them into a single file.
The modules will then be available in the browser using the `window.node2browser.require` function, 
which works pretty the same way as Node's require.

By default, the `process` object in every module contains only the `nextTick` function, simulated by `setTimeout`.

## Install and Usage

    git clone [put github link here]
    cd node2browser
    bin/node2browser <initfile> <outfile> <nodemodulesdir>

`initfile` is tipically the `index.js` in your project. From there, the tool will figure out which file are
required where.

`outfile` is where the "compiled" javascript will be. Default is `dist/out.js`.

`nodemodulesdir` is where the node modules that you want to include will be.
Sorry, for now it's very stupid and only single-file modules can be used -it's sufficient for me, if you need more drop a request to frza-AT-itu-DOT-dk-.

