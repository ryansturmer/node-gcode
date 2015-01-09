# node-gcode
GCode interpreter and simulator for node.js

Installation
------------
Install from npm
```
npm install gcode
```

Parsing a G-code File
---------------------
```js
gcode = require('gcode')
gcode.parseFile('example.nc', function(err, data) {
    console.log(JSON.stringify(data));
})
```

The data returned by the `parseFile` callback is a list of G-code blocks, where each block is an object with a `num` property (the G-code line number) and a `words` property (the list of G-code words in that block) Each G-code word is a list of two items, the word letter (G, M, X,Y,Z, etc.) and the word argument.  Word arguments are typically numbers, but the parser supports full expressions, including parameter values, so in the event that an expression or parameter value is provided, an expression-tree-like object is returned that must be evaluated.  Currently, this is left as an exercise for the reader.

The output of the above example might look like this _(note the last line that includes 3+5 in the X-axis word)_:

```js
[{"N":null,"words":[["G",17]]},
 {"N":null,"words":[["G",1],["X",1],["Y",2],["Z",3],["F",120]]},
 {"N":null,"words":[["G",1],["Z",0]]},
 {"N":null,"words":[["G",1],["Z",-0.125],["F",240]]},
 {"N":null,"words":[["G",0],["X",{"left":3,"right":5,"op":"+"}]]}]
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
