var test2 = require('./test2')
  , util = require('util')
  , wu = require('wu').wu


var MyFoo = function(mf) {
	test2.Foo.call(this,mf)
}
util.inherits(MyFoo,test2.Foo)
MyFoo.prototype.multiply = function(arg) {
	return this.bla * arg
}

var t = new MyFoo(5)

process.nextTick(function() {
	console.log(t.add(10))
	console.log(t.multiply(10))
})

wu([1,2,3]).map(function(a) {return a*2})
	.each(function(a) {
		console.log(a)
	})