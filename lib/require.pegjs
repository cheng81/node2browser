/**/

main =
	reqs:(any r:require {return r})*
	any {
		return reqs
	}

_ "spaces" = 
	space* (comment _)?
space "space" = 
	' ' / [\t\n\r]
comment "comment" =
	'//' (![\n\r] c:.)* / '/*' (!'*/' c:.)+ '*/'

any = (!require c:. {return ''})*
require = as:( i:id _ '=' _ {return i} )? 'require(' _ ("'"/'"') _ path:fpath _ ("'"/'"') _ ')' reqvar:(_ '.' _ i:id {return i})?
{
	return {
		type: 'require',
		as: as,
		path: path,
		load: reqvar
	}
}

//strval =
//	"'" chars:strvaltok+ "'" {return {type:'string',val:chars.join("")}}
//strvaltok = !"'" c:. {return c}
id =
	fstchar:('_'/[a-zA-Z]) rest:(('_'/[a-zA-Z0-9])*) {var id = [fstchar].concat(rest).join(''); return id}

fpath =
	local:('./'/'../')? _ p:path
	{
		if(local=='') {local=false}
		return {
			type: 'path',
			local: local,
			path: p
		}
	}

path =
	fst:id rest:('/' i:id {return i})*
	{
		return [fst].concat(rest)
	}