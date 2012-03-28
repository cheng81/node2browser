(function() {
	/*BRUTALLY STRIPPED FROM NODE.JS "path" module, www.nodejs.org*/
	function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}
	  function normalize(path) {
    var isAbsolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';

    // Normalize the path
    path = normalizeArray(path.split('/').filter(function(p) {
      return !!p;
    }), !isAbsolute).join('/');

    if (!path && !isAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isAbsolute ? '/' : '') + path;
  };


  	function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize(paths.filter(function(p, index) {
      return p && typeof p === 'string';
    }).join('/'));
  };
  /**/



	( function(){
		console.log('defining window.node2browser')
		var isNodeMod = function(name) {
			return name[0] != '.'
		}
		var startpath = '/**STARTPATH**/'
		var require = function(modulepath) {
			return function(reqmodpath) {
				var reqmod = isNodeMod(reqmodpath) ? reqmodpath : join(modulepath,reqmodpath)
				var thecache = window.node2browser.cache

				if(undefined == thecache[reqmod]) {
					reqmod = reqmod+'.js'
					if(undefined == thecache[reqmod]) {
						throw new Error('Module "'+reqmodpath+'" not loaded')	
					}
				}

				return thecache[reqmod]
			}
		}
		window.node2browser = {
			makerequire: require,
			require: require(startpath),
			globals: {
				process: {
					nextTick: function(fn) {
						window.setTimeout(fn,1)
					}
				}
			},
			cache: {
				util: {
					inspect: function(o) {console.log(o)}
				}
			}
	}})();

/**MODULES**/
	
}
)();

