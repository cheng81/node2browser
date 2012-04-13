var util = require('util')
  , path = require('path')
  , fs = require('fs')
  , parser = require('./requireparser')

var Node = function(data) {
	this.parent = false
	this.data = data||null
	this.children = []
}
Node.prototype.addChild = function(c) {
	c.parent = this
	this.children.push(c)
	return c
}
Node.prototype.leaf = function() {
	return this.children.length == 0
}
Node.prototype.root = function() {
	return this.parent==false
}

var visited = {}
var isVisited = function(f) {
	return (visited[f] != undefined)
}
var setVisited = function(f) {
	visited[f] = {
		defined:false
	}
}
var isDefined = function(f) {
	return visited[f].defined
}
var setDefined = function(f) {
	visited[f].defined = true
}

function walk(node,modules) {
	if(!node) {return}
	if(!node.leaf()) {
		for (var i = 0; i < node.children.length; i++) {
			var cur = node.children[i]
			if(cur.visited) {continue} else {walk(cur,modules)}
		}
	}
	modules.push({
		file:node.modulefile,
		isNodeModule:node.isNodeModule
	})
	node.visited = true
	walk(node.parent,modules)
}

function resolve(file,node) {
	if(isVisited(file)) {
		if(false==isDefined(file)) {
			console.log('!!!! Circular dependency detected',file,node.parent.modulefile)
			throw new Error('Circular dependency')
		}
		console.log('alreadysolved>',file)
		return
	}
	console.log('resolving>',file)
	setVisited(file)
	var contents = fs.readFileSync(file,'utf8')
	var ast = parser.parse(contents)
	for (var i = 0; i < ast.length; i++) {
		var cur = ast[i]
		var newnode = node.addChild(new Node(cur))
		if(cur.path.local==false) {
			newnode.modulefile = cur.path.path.join('/')
			newnode.isNodeModule = true
		} else {
			var modpath = cur.path.local + cur.path.path.join('/')
			var newfile = path.join(path.dirname(file),modpath)
			var stat = null
			try {
				stat = fs.statSync(newfile)
			} catch(e) {
				newfile = newfile + '.js'
				stat = fs.statSync(newfile)
			}
			
			newnode.modulefile = newfile
			if(stat.isFile()) {
				resolve(newfile,newnode)
			} else if(stat.isDirectory()) {
				newfile = path.join(newfile,'index.js')
				newnode.modulefile=newfile
				resolve(newfile,newnode)
			}
		}
	}
	setDefined(file)
}

function compile(requireAs, initfile, outfile, modules, nodemodulesPath) {
	var template = fs.readFileSync(path.join(__dirname,'../template/main.js'),'utf8')
	template = template.replace('/**STARTPATH**/',path.dirname(initfile))
	template = template.replace('/**REQUIREDAS**/',requireAs)
	template = template.replace('/**INITFILE**/',initfile)
	var idx = template.indexOf('/**MODULES**/')
	var prefix = template.substring(0,idx)
	var postfix = template.substring(idx+'/**MODULES**/'.length)

	var fd = fs.openSync(outfile,'w')
	fs.writeSync(fd,prefix)
	var done = []
	var isDone = function(f) {
		for (var i = 0; i < done.length; i++) {
			if(f==done[i]) {return true}
		}
		return false
	}

	if(nodemodulesPath) {
		compileNodeModules(fd,nodemodulesPath)
	}

	for (var i = 0; i < modules.length; i++) {
		var mod = modules[i]
		if(mod.isNodeModule) {continue}
		if(isDone(mod.file)) {continue} else {done.push(mod.file)}
		var tmpl = makeModuleTemplate(mod.file)
		fs.writeSync(fd,tmpl)
	}
	fs.writeSync(fd,postfix)
	fs.close(fd)
	console.log('compiled>',outfile)
}
function compileNodeModules(fd,modPath) {
	var isJS = function(name) {
		var idx = name.indexOf('.js')
		return idx>0 && name.length==(idx+3)
	}
	var realpath = path.join(process.cwd(),modPath)
	var files = fs.readdirSync(realpath)
	for (var i = 0; i < files.length; i++) {
		var f = files[i]
		if(isJS(f)) {
			var tmpl = makeModuleTemplate(path.join(realpath,f),f)
			fs.writeSync(fd,tmpl)
		}
	}
}
function makeModuleTemplate(file,as) {
	console.log('compiling>',file)
	as = as || file
	var modulepath = path.dirname(as)
	var contents = fs.readFileSync(file,'utf8')

	var template = fs.readFileSync(path.join(__dirname,'../template/module.js'),'utf8')
	return template.replace('/**MODULEFILE**/',as)
		.replace('/**MODULEPATH**/',modulepath)
		.replace('/**CONTENTS**/',contents) + "\n"
}

function boot(reqAs,initfile,outfile,nodemodulesPath) {
	visited = {}
	var root = new Node()
	root.modulefile = initfile
	resolve(initfile,root)

	var modules = []
	walk(root,modules)
	compile(reqAs,initfile,outfile,modules,nodemodulesPath)
}
module.exports = {
	compile: boot
}