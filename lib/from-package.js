var mapLimit = require('map-limit')
var registry = require('npm-stats')()
var truthy = function () { return true }
var noop = function () {}

var ASYNC_LIMIT = 20

var depKeys = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

module.exports = packageDependencies
function packageDependencies (packageJson, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = opt || {}
  }
  opt = opt || {}
  cb = cb || noop

  var allDeps = depKeys.map(function (depKey) {
    var dict = packageJson[depKey] || {}
    var nameList = Object.keys(dict)
    return nameList.map(function (name) {
      return {
        name: name,
        list: depKey,
        version: dict[name]
      }
    })
  })
    .reduce(concat, []) // flatten
    .filter(opt.filter || truthy) // filter before npm-stats
  gatherStats(allDeps, cb)
}

function concat (a, b) {
  return a.concat(b)
}

function gatherStats (deps, cb) {
  mapLimit(deps, ASYNC_LIMIT, function (item, next) {
    registry.module(item.name).info(function (err, info) {
      item.stats = null

      // handle errors without stopping everything
      if (err || !info) {
        item.error = err
        return next(null, item)
      }

      item.stats = info
      next(err, item)
    })
  }, cb)
}
