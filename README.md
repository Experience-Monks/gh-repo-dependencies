# gh-repo-dependencies

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

For a GitHub URL like `"Jam3/three-bmfont-text"`, returns a list of npm dependencies from the `package.json` and their registry stats.

## Install

```sh
npm install gh-repo-dependencies --save
```

## Example

```js
var ghRepoDeps = require('gh-repo-dependencies')

ghRepoDeps('Jam3/three-bmfont-text', function (err, deps) {
  if (err) throw err
  
  var dependency = deps[0]
  
  console.log(dependency.name + '@' + dependency.verison)
  //> "inherits@^2.0.1"
  
  console.log(dependency.stats.description)
  //> "Browser-friendly inheritance..."
  
  console.log(dependency.stats.license)
  //> "ISC"
})
```

## Usage

[![NPM](https://nodei.co/npm/gh-repo-dependencies.png)](https://www.npmjs.com/package/gh-repo-dependencies)

#### `ghRepoDeps(url, [opt], [cb])`

Fetches repository dependencies from a GitHub `url` (see [here](https://www.npmjs.com/package/github-url-to-object) for valid formats), querying its `package.json` file.

Options:

- `token` (String) optional GitHub API token to use when querying `package.json`
- `ref` (String) the commit hash or branch name to fetch the `package.json` content from
- `filter` (Function) optionally filter the dependencies before querying npm registry 

For example, `filter` could look like this to avoid querying stats of devDependencies.

```js
function filterDeps (package) {
  return package.list === 'dependencies'
}
```

The callback takes the form `(err, data)`, where `data` is a flat array of dependencies gleaned from `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies` (in that order) unless otherwise filtered.

Each item has the following data:

```js
{
  name: 'inherits',     // name as it appears in package.json
  version: '^2.0.1',    // version range from package.json
  list: 'dependencies', // type of dependency
  stats: { ... }        // registry stats
  error: Error          // Error object if there was a problem
}
```

If `stats` could not be retrieved for that package, it will be null and `error` will be populated with the Error object. Otherwise `error` will not be defined.

The stats are fetched using [npm-stats](https://www.npmjs.com/package/npm-stats).

## License

MIT, see [LICENSE.md](http://github.com/Jam3/gh-repo-dependencies/blob/master/LICENSE.md) for details.
