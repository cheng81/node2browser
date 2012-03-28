var test2 = require('./test2')
  , wu = require('wu').wu

var t = new test2.Foo(5)

process.nextTick(function() {
	console.log(t.add(10))
})

wu([1,2,3]).map(function(a) {return a*2})
	.each(function(a) {
		console.log(a)
	})