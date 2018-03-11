const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const allowedEnvs = ['dev', 'dist'];

// Set the correct environment
let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'dev';
} else if (args.env) {
  env = args.env;
} else {
  env = 'dev';
}


// depending of the cmd in the console, run dev or the specific task (see conditions above)
// and go get the right file
function buildConfig(wantedEnv) {
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
  let validEnv = isValid ? wantedEnv : 'dev';
  let config = require(path.join(__dirname, 'webpack/' + validEnv));

  return config;
}

module.exports = buildConfig(env);
