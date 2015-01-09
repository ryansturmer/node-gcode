# node-gcode
GCode interpreter and simulator for node.js

To use:

```
gcode = require('gcode')
gcode.parseFile('example.nc', function(err, data) {
    console.log(data);
})
```

The data returned by the `parseFile` callback is a list of G-code blocks, where every block is an object mapping word letters (G, M, X,Y,Z, etc) to their arguments.  Every G-code block includes a line number, which appears as an N-word (lol) even if no line number was supplied in the original G-code file.  In this case, the N-word is null.  In most cases, the arguments are simply numbers, but in the case of an expression, parameter value, or unary operator value, the arguments are returned as an expression tree that must be evaluated.

```
[ { N: null, G: 17 },
  { N: null, G: 1, X: 1, Y: 2, Z: 3, F: 120 },
  { N: null, G: 1, Z: 0 },
  { N: null, G: 1, Z: -0.125, F: 240 },
  { N: null, G: 2, I: 2, J: 3.5, K: 0 },
  { N: null, G: 1, X: 1, Y: 3 },
  { N: null, G: 1, X: 0, Y: 0, Z: 0 },
  { N: null, G: 0, X: 0, Y: 0, Z: 0, F: 300 },
  { N: null, G: 0, X: { left: 3, right: 5, op: '+' } } ]
```



