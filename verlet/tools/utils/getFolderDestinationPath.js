const path = require('path');

module.exports = function(mPath, mSource , mDest) {
  return path.join(mDest, mPath.replace(mSource,''));
}
