' /**
'  * @member get
'  * @memberof module:rodash
'  * @instance
'  * @description
'  *   Resolve a nested 'dot' notation path safely.  This is primarily allow things like
'  *   "myValue = a.b.c.d.e.f" to run without crashing the VM when an intermediate value is invalid.
'  *
'  * @example
'  *
'  * data = { a: 1 b: { c: 2 d: { e: 3 f: [4, 5] } } }
'  * value = _.get(data, ["b","d","f"])
'  * '  => [4, 5]
'  *
'  * value = _.get(data, "b.d.f[0]")
'  * '  => 4
'  *
'  * value = _.get(data, "a[0]")
'  * '  => invalid
'  *
'  */