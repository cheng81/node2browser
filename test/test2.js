var Foo = function(bla) {
	this.bla = bla
}
Foo.prototype.add = function(foo) {
	return this.bla + foo
}

module.exports = {
	Foo: Foo
}