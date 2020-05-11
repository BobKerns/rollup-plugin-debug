<<<<<<< HEAD
# rollup-plugin-debug

This project is currently empty beyond the project template. The code to be moved here wraps an array of plugins and reports on how the build functions.

# Content

## Primary organization

The important files are the outputs included in the published module, and the sources that
produce them. The rest are supporting mechanisms.

## package.json

This describes the package, it's role in the world,

You should edit package.json, with special attention to these fields:
* `name:`
* `version:`
* `description:`
* `repository.url:`
* `keywords:`
* `license:`
* `bugs.url:`
* `homepage:`

## Continuous Integration Integration
Three free Continuous Integration workflows are configured out of the box.  Remove any you
you do not need, or disable them in the relevant service.

You probably do not need multiple builds on multiple services, but this will let you see each and make a choice. For simple things at least, the features are very similar. It is very useful to be able to build and test on multiple environments in parallel, something each of the services provides.

* [Circle CI](https://circleci.com)
* [Travis CI](https://travis-ci.com)
* [GitHub Workflows (CI)](https://github.com)

## /lib/

This holds the built Javascript files. By default, three versions are built, for compatibility with various module systems. Ultimately, the world is moving toward the ECMAScript module format, but in the meantime,
### /lib/esm
This holds files in the ECMAScript module format.

### /lib/cjs
This uses the CommonJS used traditionally by node.

### /lib/umd
This holds files in the UMD format, a flat file loadable by web browsers.

## [/assets](/assets/README.md)
Data files to be used in documentation or runtime in the application.

## [/config](/config/README.md)
This holds files used to globally configure the project. These are often redirected from the project root, to place them in one place, and to enable the use of typescript rather than javascript.

## [/devtools](/devtools/README.md)
This holds code used to to build the main project. It is built before the main project is configured.

It is initially empty.

## /docs
A generated directory with documentation. Some content may be installed from [/assets](/assets/README.md)

### /docs/api
The generated API documentation via [typedoc](https://typedoc.org)

## /node_modules
This directory is created and managed by [npm](https://npmjs.com), via the `npm install` command.

## [/src](/src/README.md)
This hierarchy contains the project's source code and related tests.

# Top level files
* .editorconfig
* .gitignore
* .npmignore — hides build infrastructure, sources, etc. from the final npm package.
* travis.yml -- configuration for building automatically on [Travis](https://travis-ci.com/)
* .circle-ci/ -- configuration for building automatically on [Circle CI](https://circleci.com)
*  .github/workflows -- configuration for building automatically on GitHub Workflows
* rollup.config.js -- redirects to [/config/rollup.config.ts](/config/rollup.config.ts)
*

[Continuous Integration Integration]: #continuous-integration-integration
