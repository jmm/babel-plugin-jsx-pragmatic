# About

babel / babelify has a `jsxPragma` option that will be used when transforming JSX to function calls instead of the default function `React.createElement`.

This babel plugin is a companion to that feature that allows you to dynamically load a module associated with the `jsxPragma` value.

Example:

Given this file:

```js
<Some jsx="element" />
```

babel would normally transform the JSX to:

```js
React.createElement(Some, { jsx: "element" });
```

By setting the `jsxPragma` option like this:

```js
babel.transform(code, {
  jsxPragma: 'whatever',
})
```

It would instead transform it to:

```js
whatever(Some, { jsx: "element" });
```

However, you would still likely need to pull in a module corresponding to `whatever`:

```js
import whatever from 'whatever';
// or
var whatever = require('whatever');
```

This plugin allows you to make that part dynamic as well:

```js
babel.transform(code, {
  jsxPragma: 'whatever',
  plugins: ['babel-plugin-jsx-pragmatic'],
})
```

# Known Issues

* This currently relies on the module name exactly matching the `jsxPragma` value.

* This should be implemented by inserting an `import` declaration to load the module, but due to an issue with babel ([babel/babel#1777](https://github.com/babel/babel/issues/1777)) that's not currently possible and therefore it inserts a `require()` call and only works for CommonJS output.

* Currently only supports `jsxPragma` value that is a valid identifier. E.g. `some.thing` or `some['thing']` would not work.

* Currently does not take into account when a file actually contains a JSX pragma comment.
