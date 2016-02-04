var should = require('chai').should();
var expect = require('chai').expect;
var gcode = require("../index");
var util = require('util');

describe('G-Code String', function(done) {

	describe('Parse String', function(done) {
		it('Should return correct output for parsing a simple string.', function(done) {
			gcode.parseString('N03 G1 X1.234 Y5.678 Z-9.101112 F250', function(err, data) {
				should.not.exist(err);
				data.forEach(function(item) {
					words = item.words
					words.forEach(function(word) {
						if(word[0] === 'N') { word[1].should.equal(3)}
						if(word[0] === 'G') { word[1].should.equal(1)}
						if(word[0] === 'X') { word[1].should.equal(1.234)}
						if(word[0] === 'Y') { word[1].should.equal(5.678)}
						if(word[0] === 'Z') { word[1].should.equal(-9.101112)}
						if(word[0] === 'F') { word[1].should.equal(250)}
					});
				})
				done();
			});
		});
	});

	describe('Parse Multiline String', function(done) {
		it('Should return correct output for parsing a simple string.', function(done) {
			gcode.parseString('N03 G1 X1.234 Y5.678 Z-9.101112 F250\nG0 A1 B2', function(err, data) {
				should.not.exist(err);
				data[0].words.forEach(function(word) {
					if(word[0] === 'N') { word[1].should.equal(3)}
					if(word[0] === 'G') { word[1].should.equal(1)}
					if(word[0] === 'X') { word[1].should.equal(1.234)}
					if(word[0] === 'Y') { word[1].should.equal(5.678)}
					if(word[0] === 'Z') { word[1].should.equal(-9.101112)}
					if(word[0] === 'F') { word[1].should.equal(250)}
				});
				data[1].words.forEach(function(word) {
					if(word[0] === 'G') { word[1].should.equal(0)}
					if(word[0] === 'A') { word[1].should.equal(1)}
					if(word[0] === 'B') { word[1].should.equal(2)}
				});
				done();
			});
		});
	});

	describe('Space Invariance', function(done) {
		it('Should parse differently spaced lines as identical.', function(done) {
			gcode.parseFile('test/spaces.nc', function(err, data) {
				should.not.exist(err);
				data.forEach(function(item) {
					words = item.words
					words.forEach(function(word) {
						if(word[0] === 'G') { word[1].should.equal(0.0)}
						if(word[0] === 'X') { word[1].should.equal(1.0)}
						if(word[0] === 'Y') { word[1].should.equal(2.0)}
						if(word[0] === 'Z') { word[1].should.equal(3.0)}
					});
				})
				done();
			});
		});
	});

	describe('G-Code Extensions', function(done) {
		it('Should call parser functions for GX.Y functions.', function(done) {

			var MyGCodeRunner = function() {
			    gcode.Interpreter.call(this);
			}
			util.inherits(MyGCodeRunner, gcode.Interpreter)

			MyGCodeRunner.prototype.G38_2 = function(args) {
				args.X.should.equal(1);
			    args.Y.should.equal(2);
			    args.Z.should.equal(3);
			    done();
			}

			runner = new MyGCodeRunner();

			runner.interpretFile('test/extensions.nc');
		});
	});


	describe('Complete Callback', function(done) {
		it('Should call the interpretFile callback at the end of interpreting the file.', function(done) {
			var MyGCodeRunner = function() {
			    gcode.Interpreter.call(this);
			    this.attribute = "Test Attribute";
            }
			util.inherits(MyGCodeRunner, gcode.Interpreter)
			runner = new MyGCodeRunner();
			runner.interpretFile('test/spaces.nc', function(err, result) {
                expect(this.attribute).to.equal("Test Attribute");
                done();   
            });
		});
	});


});
