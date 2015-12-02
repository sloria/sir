import * as utils from 'utils/github';

describe('(utils) Github utils', function() {
  describe('repoName', function() {
    it('should join lowercase by default', function() {
      assert.equal(utils.repoName('sloria', 'TextBlob'), 'sloria/textblob');
    });

    it('should not lowercase if lowercase alse', function() {
      assert.equal(utils.repoName('sloria', 'TextBlob', false), 'sloria/TextBlob');
    });
  });

  describe('validateRepoName', function() {
    it('should validate repo names', function() {
      assert.isTrue(utils.validateRepoName('sloria/textblob'));
      assert.isTrue(utils.validateRepoName('sloria/TextBlob'));
      assert.isTrue(utils.validateRepoName('  sloria/TextBlob'));
      assert.isFalse(utils.validateRepoName('sloria'));
      assert.isFalse(utils.validateRepoName(''));
      assert.isFalse(utils.validateRepoName(null));
    });
  });
});
