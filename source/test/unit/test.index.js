
'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
require('jsdom-global')();
const indexjs = require('../../js/index');

describe('test index.js functions', function() {
  it('#addRow()', function(done) {
    const appendChild = sinon.spy();
    const mockTable = {
      appendChild: appendChild,
    };

    indexjs.addRow(mockTable, 'testType', ['a', 'b', 'c']);

    sinon.assert.calledOnce(appendChild);
    done();
  });

  it('#detectobject()', function(done) {
    const f = indexjs.text;
    expect(f('sample1.jpg')).to.equal('smartphone');
    expect(f('sample2.jpg')).to.equal('laptop');
    expect(f('sample3.jpg')).to.equal('niether');
    
    done();
  });
});
