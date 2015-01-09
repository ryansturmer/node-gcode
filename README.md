# node-gcode
GCode interpreter and simulator for node.js

To use:

```js
gcode = require('gcode')
gcode.parseFile('example.nc', function(err, data) {
    console.log(data);
})
```

The data returned by the `parseFile` callback is a list of G-code blocks, where every block is an object mapping word letters (G, M, X,Y,Z, etc) to their arguments.  Every G-code block includes a line number, which appears as an N-word (lol) even if no line number was supplied in the original G-code file.  In this case, the N-word is null.  In most cases, the arguments are simply numbers, but in the case of an expression, parameter value, or unary operator value, the arguments are returned as an expression tree that must be evaluated.

```js
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

G-code Interpreters
-------------------
Writing a custom interpreter for G-code is easy with the `Interpreter` object provided by the gcode library.  To create your own interpreter, use the following example.:

```js
Interpreter = require('gcode').Interpreter;

var MyGCodeRunner = function() {
    Interpreter.call(this);
}
util.inherits(MyGCodeRunner, Interpreter)

MyGCodeRunner.prototype.G0 = function(args) {
    console.log("Got a G0 code!");
    console.log(args);
}

runner = new MyGCodeRunner();

runner.interpretFile('example.nc');
```

Any handlers attached to the interpreter whose names correspond to G or M codes are called in turn as those codes are parsed from the incoming file stream.
