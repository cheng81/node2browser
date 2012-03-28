(function(r) {
	var file = '/**MODULEFILE**/'
	var exp = {}
	var mod = {
		exports: exp
	}
	console.log('defining module',file);
	(function(require,module,exports,process) {

/*---------------------------------------------------*/
/**CONTENTS**/
/*---------------------------------------------------*/

	}
	)(r,mod,exp,window.node2browser.globals.process);

	window.node2browser.cache[file] = mod.exports
	console.log('defined',file,mod.exports)
	var idx = file.indexOf('/index.js')
	if(idx>0&&file.length==(idx+'/index.js'.length)) {
		window.node2browser.cache[file.substring(0,idx)] = mod.exports
	}
}(window.node2browser.makerequire('/**MODULEPATH**/')));

