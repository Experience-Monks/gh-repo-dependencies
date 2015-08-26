var test = require('tape')
var ghauth = require('ghauth')
var repoDeps = require('./')

test('list dependencies for a npm module from GitHub url', function (t) {
  t.plan(3)
  ghauth({
    configName: 'gh-repo-dependencies',
    scopes: ['user', 'repo']
  }, function (err, data) {
    if (err) throw err
    repoDeps('Jam3/three-bmfont-text', {
      token: data.token,
      ref: '7ea4f08e1b7a951333d125e2e0b9294313f99007',
      filter: function (pkg) {
        return pkg.list === 'dependencies'
      }
    }, function (err, data) {
      if (err) return t.fail(err)
      var names = data.map(function (x) { return x.name })
      var isList = data.every(function (x) { return x.list === 'dependencies' })

      t.equal(isList, true, 'only gets dependencies')
      t.deepEqual(names, [ 'inherits', 'layout-bmfont-text', 'quad-indices', 'xtend' ])
      t.deepEqual(typeof data[0].stats.description, 'string', 'gets npm stats')
    })
  })
})
