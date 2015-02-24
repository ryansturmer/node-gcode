var Transform = require('stream').Transform;
var util = require('util');
var parser = require('./parser');
var fs = require('fs');
var byline = require('byline');

// Strips spaces out of all incoming g-code except for comments
function GCodeScrubber() {
	this.in_comment = false;
	Transform.call(this);
}
util.inherits(GCodeScrubber, Transform);

GCodeScrubber.prototype._transform = function(s, enc, done) {
	try {
		for(var result = [], i=0, j=0; i<s.length; i++) {
			var c = String.fromCharCode(s[i]);
			var keep_result = true;
			switch(c) {
				case ' ':
				case '\t':
					keep_result = false;
					break;
				case '(':
					if(this.in_comment) {
						// ERROR
					} else {
						this.in_comment = true;
						keep_result=false;
					}
					break;
				case ')':
					if(this.in_comment) {
						this.in_comment = false;
						keep_result=false;
					} else {
						// ERROR
					}
				default:
					if(this.in_comment) { keep_result = false;}
					break;
			}
			if(keep_result) {
				result[j++] = c;
			}
		}
		var output = result.join('');
		this.push(output);
		done();
	} catch(e) {
		console.log(e);
		done();
	}
}

function GCodeParser(options) {
	if (!options) options = {};
	options.objectMode = true;
	Transform.call(this, options);
}
util.inherits(GCodeParser, Transform);

GCodeParser.prototype._transform = function (object, encoding, done) {
	if(encoding === 'buffer') {
		object = object.toString('utf8')
	}
	this.push(parser.parse(object));
	done();
};

var Interpreter = function(options) {}

Interpreter.prototype._exec = function(cmd, args) {
	if((cmd in this) && (typeof this[cmd] == 'function')) {
		f = this[cmd];
		return f(args).bind(this);
	}
}

Interpreter.prototype._handle_line = function(line) {
	var words = {}
	line.words.forEach(function(word) {
		var letter = word[0];
		var arg = word[1];
		switch(letter) {
			case 'G':
			case 'M':
			break;
			default:
				words[letter] = arg;
				break;
		}
	}.bind(this));

	line.words.forEach(function(word) {
		var letter = word[0];
		var arg = word[1];
		switch(letter) {
			case 'G':
			case 'M':
				func = (letter + arg).replace('.','_');
				this._exec(func, words)
			break;
			default:
			break;
		}
	}.bind(this));
}

Interpreter.prototype.interpretFile = function(file) {
	var results = [];
	fs.createReadStream(file)
	.pipe(new GCodeScrubber())
	.pipe(byline())
	.pipe(new GCodeParser())
	.on('data', function(line) {
		this._handle_line(line);
	}.bind(this))
}

var parseFile = function(file, callback) {
	var results = [];
	fs.createReadStream(file)
	.pipe(new GCodeScrubber())
	.pipe(byline())
	.pipe(new GCodeParser())
	.on('data', function(line) {
		results.push(line);
	})
	.on('end', function() {
		typeof callback === 'function' && callback(null, results);
	});
}

module.exports.parseFile = parseFile;
module.exports.Interpreter = Interpreter;
