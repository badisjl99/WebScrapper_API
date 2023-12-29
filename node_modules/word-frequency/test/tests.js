/*
* Module Dependencies
*/
var wordFrequency = require('..'),
    chai = require('chai'),
    should = chai.should();

describe('Word Frequency', function() {
    describe('#frequencies()', function() {
        it('should return word frequencies for text', function() {
            wordFrequency('This is a test').should.eql({this: 1, is: 1, a: 1, test: 1});
            wordFrequency('This is something like a test !').should.eql({this: 1, is: 1, something: 1, like: 1, a: 1, test: 1});
        });
        it('should return word frequencies for html', function() {
            wordFrequency('<div class="test">This is <span>a</span> test').should.eql({this: 1, is: 1, a: 1, test: 1});
        });
        it('should be able to be case sensitive', function() {
            wordFrequency('THIS is a test of this', {caseSensitive: true}).should.eql({THIS: 1, is: 1, a: 1, test: 1, of:1, this:1});
        });
        it('should be able to be not case sensitive', function() {
            wordFrequency('THIS is a test of this').should.eql({this: 2, is: 1, a: 1, test: 1, of:1});
        });
    });
});