/*

  Tests for LoadBuilder
  Requires expresso
  >  expresso shot.js

  // TODO: check excludes, fix $scripts

*/

var assert = require('assert'),
    fs = require('fs');

// require loadbuilder
var LoadBuilder = require('loadbuilder');

// check the configs are correctly set
exports.testConfig = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  assert.equal(testRunner.options.docRoot, './');
  assert.equal(testRunner.options.distRoot, 'testdist/');
  assert.equal(testRunner.options.modPath, 'modules/');

};


// simple test, load a module
exports.testSimple = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  var modCount = 0;
  // load mod1
  testRunner.load('mod1-simple');
  // check deps are loaded
  var expected = ['mod1-simple', 'mod1_a', 'sub/mod1_b'];
  testRunner.dependencies.module.forEach(function(mod){
    assert.equal(expected.shift(), mod.name);
    modCount++;
  });
  // check load order is correct
  var stack = LoadBuilder.Dependency.getCallStack(testRunner.dependencies);
  expected = ['sub/mod1_b', 'mod1_a', 'mod1-simple'];
  stack.forEach(function(item){
    assert.equal(expected.shift(), item.name);
    modCount++;
  });
  beforeExit(function(){
    assert.equal(6, modCount, 'All modules loaded.');
  });

};
// multiple file test
exports.testMultiple = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  var modCount = 0;
  // load mod2
  testRunner.load('mod2-multiple');
  // check deps are loaded
  var expected = ['mod2-multiple', 'mod2_a', 'mod2_b'];
  testRunner.dependencies.module.forEach(function(mod){
    assert.equal(expected.shift(), mod.name);
    modCount++;
  });
  // check load order is correct
  var stack = LoadBuilder.Dependency.getCallStack(testRunner.dependencies);
  expected = ['mod2_b', 'mod2_a', 'mod2-multiple'];
  stack.forEach(function(item){
    assert.equal(expected.shift(), item.name);
    modCount++;
  });
  beforeExit(function(){
    assert.equal(6, modCount, 'All modules loaded.');
  });

};
// nasty, complicated test
exports.testTree = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  var modCount = 0;
  // load mod3
  testRunner.load('mod3-tree');
  // check load order is correct
  var stack = LoadBuilder.Dependency.getCallStack(testRunner.dependencies);
  var expected = ['mod3_b', 'mod3_a', 'mod3_c', 'mod3-tree'];
  stack.forEach(function(item){
    assert.equal(expected.shift(), item.name);
    modCount++;
  });
  beforeExit(function(){
    assert.equal(4, modCount, 'All modules loaded.');
  });

};
// script loading test
exports.testScript = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  var modCount = 0;
  // load mod4
  testRunner.load('mod4-script');
  // check load order is correct
  var stack = LoadBuilder.Dependency.getCallStack(testRunner.dependencies);
  var expected = ['javascripts/script1.js', '$../javascripts/script2.js', 'mod4_a', 'mod4-script'];
  stack.forEach(function(item){
    assert.equal(expected.shift(), item.name);
    modCount++;
  });
  beforeExit(function(){
    assert.equal(4, modCount, 'All items loaded.');
  });

};
// bundle test
exports.testBundle = function(beforeExit){

  var testRunner = LoadBuilder.builder({
    docRoot: '.',
    distRoot: 'testdist',
    modPath: 'modules'
  });
  var modCount = 0;
  // load mod4
  testRunner.bundle('mod2-multiple');
  // check file exists
  fs.stat('testdist/modules/mod2-multiple.js', function(err, stats) {
    assert.ok(!err);
    fs.unlinkSync('testdist/modules/mod2-multiple.js');
    modCount++;
  });

  // check load order is correct
  var stack = LoadBuilder.Dependency.getCallStack(testRunner.dependencies);
  var expected = ['mod2-multiple', 'mod2_a', 'mod2_b'];
  stack.forEach(function(item){
    assert.equal(expected.shift(), item.name);
    modCount++;
  });
  beforeExit(function(){
    assert.equal(4, modCount, 'Bundle test complete.');
  });

};