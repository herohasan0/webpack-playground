# Webpack

## Concepts

At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a <b><u>dependency graph</u></b> from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.

### Dependency Graph

Any time one file depends on another, webpack treats this as a <i>dependency</i>. This allows webpack to take non-code assets, such as images or web fonts, and also provide them as dependencies for your application.

When webpack processes your application, it starts from a list of modules defined on the command line or in its configuration file. Starting from these entry points, webpack recursively builds a dependency graph that includes every module your application needs, then bundles all of those modules into a small number of bundles - often, only one - to be loaded by the browser.

Bundling your application is especially powerful for HTTP/1.1 clients, as it minimizes the number of times your app has to wait while the browser starts a new request. For HTTP/2, you can also use Code Splitting to achieve best results.

- Modular programming is a software design technique that emphasizes separating the functionality of a program into independent, interchangeable modules, such that each contains everything necessary to execute only one aspect of the desired functionality.
