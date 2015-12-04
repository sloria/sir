import assert from 'assert';

describe('(Framework) Karma Plugins', function () {
  it('Should expose "assert" globally.', function () {
    assert.equal(typeof assert, 'function');
  });
});
