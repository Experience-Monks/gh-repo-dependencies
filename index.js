var ghApiStream = require('gh-api-stream')
var ghUrl = require('github-url-to-object')
var packageDependencies = require('./lib/from-package')

module.exports = ghRepoDependencies
function ghRepoDependencies (url, opt, cb) {
  var urlResult = ghUrl(url)
  var user = urlResult.user
  var repo = urlResult.repo

  getPackageJson({
    token: opt.token,
    user: user,
    repo: repo,
    ref: opt.ref
  }, function (err, packageJson) {
    if (err) return cb(err)
    packageDependencies(packageJson, opt, cb)
  })
}

function getPackageJson (opt, callback) {
  var query
  if (opt.ref) {
    query = { ref: opt.ref }
  }

  ghApiStream('repos/' + opt.user + '/' + opt.repo + '/contents/package.json', {
    token: opt.token,
    query: query
  })
    .on('data', function (response) {
      var packageStr = new Buffer(response.content, 'base64').toString()
      callback(null, JSON.parse(packageStr))
    })
    .on('error', function (err) {
      callback(err)
    })
}
