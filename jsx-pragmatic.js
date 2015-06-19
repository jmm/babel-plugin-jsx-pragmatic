/**
 * Insert code to load the module corresponding to `jsxPragma`.
 * Supposed to be implemented via `import` declaration but blocked by
 * https://github.com/babel/babel/issues/1777
 * So currently implemented via `require()` and only for CommonJS.
 */

module.exports = function jsxPragmatic (babel) {
  var
    t = babel.types,
    // Node representing import declaration.
    pragmaImport,
    transforms = {};

  /**
   * Retrieve or generate `pragmaImport`.
   * This method should be unnecessary, but currently unaware of a way to
   * access options passed to babel in this scope (as opposed to visitor func).
   */
  function getPragmaImport (opts) {
    pragmaImport = pragmaImport ||

        // This shouldn't be necessary, see babel/babel#1777
        t.variableDeclaration(
          'var',
          [t.variableDeclarator(
            t.identifier(opts.jsxPragma),
            t.callExpression(
              t.identifier('require'), [
                t.literal(opts.jsxPragma)
              ]
            )
          )]
        )

        ||

        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier(opts.jsxPragma))],
          t.literal(opts.jsxPragma)
        );

    return pragmaImport;
  }

  transforms = {
    Program: {
      // This whole thing should be unnecessary. See babel/babel#1777.
      enter: function (program, parent, scope, file) {
        file.set(
          'eligible',
          ['common', 'commonStrict'].indexOf(file.opts.modules) >= 0
        );
      },
      // enter

      exit: function (program, parent, scope, file) {
        var
          first = program.body[0],
          pragmaImport;

        if (! (file.get('eligible') && file.get('jsxDetected'))) return;

        pragmaImport = getPragmaImport(this.state.opts);

        // Detect whether program begins with `use strict` directive, to insert
        // module load code in proper location.
        if (
          t.isExpressionStatement(first) &&
          // TODO: This is a flawed check, but currently the same one babel
          // itself uses. I could check `node.raw`, but note that it is not yet
          // standardized in ESTree.
          t.isLiteral(first.expression, { value: "use strict" })
        ) {
          // Or this.get("body.0").
          this.get("body")[0].insertAfter(pragmaImport);
        }
        else this.unshiftContainer('body', pragmaImport);
      },
      // exit
    },
    // Program

    JSXElement: function (node, parent, scope, file) {
      file.set('jsxDetected', true);
    },
    // CallExpression
  };

  return new babel.Transformer("jsx-pragmatic", transforms);
};
// jsxPragmatic
