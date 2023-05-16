// Try to run this file with node and see the result
// node bundler.js
// You will see the bundled code in the console
// This is a very basic bundler which can bundle only one file
// Copy and paste the bundled code in the browser console and see the result

const fs = require("fs");
const babylon = require("babylon");
const path = require("path");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");

let ID = 0;

function createAssest(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babylon.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;

  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

function createGraph(entry) {
  const mainAsset = createAssest(entry);

  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAssest(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

function budle(graph) {
  let modules = "";

  graph.forEach((mod) => {
    modules += `${mod.id}: [
        function(require, module, exports){
            ${mod.code}
        },
        ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
        (function(modules) {
            function require(id) {
                const [fn, mapping] = modules[id];

                function localRequire(relativePath) {
                    return require(mapping[relativePath]);
                }

                const module = { exports: {} };

                fn(localRequire, module, module.exports);

                return module.exports;
            }

            require(0);
        })({${modules}})
`;

  return result;
}

const graph = createGraph("./entry.js");
const result = budle(graph);

console.log("result", result);
