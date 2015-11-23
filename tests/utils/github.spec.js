import * as utils from 'utils/github';

describe('(utils) Github utils', () => {
  describe('repoName', () => {
    it('should join lowercase by default', () => {
      assert.equal(utils.repoName('sloria', 'TextBlob'), 'sloria/textblob');
    });

    it('should not lowercase if lowercase = false', () => {
      assert.equal(utils.repoName('sloria', 'TextBlob', false), 'sloria/TextBlob');
    });
  });

  describe('validateRepoName', () => {
    it('should validate repo names', () => {
      assert.isTrue(utils.validateRepoName('sloria/textblob'));
      assert.isTrue(utils.validateRepoName('sloria/TextBlob'));
      assert.isTrue(utils.validateRepoName('  sloria/TextBlob'));
      assert.isFalse(utils.validateRepoName('sloria'));
      assert.isFalse(utils.validateRepoName(''));
      assert.isFalse(utils.validateRepoName(null));
    });
  });
});
