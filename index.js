var ghApi = require('gh-api')
var ghUrl = require('github-url-to-object')
var packageDependencies = require('package-dependency-stats')

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

  ghApi('repos/' + opt.user + '/' + opt.repo + '/contents/package.json', {
    token: opt.token,
    query: query
  }, function (err, response) {
    if (err) return callback(err)
    var packageStr = new Buffer(response.content, 'base64').toString()
    callback(null, JSON.parse(packageStr))
  })
}
