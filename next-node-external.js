// file path: ~/lib/next-node-external.js

// This file forces the browser bundle to ignore Node.js built-in modules
// when they are being pulled in by server-side libraries (like gtoken/firebase-admin).

// The names of the modules to force externalization on
const nodeModules = [
  "fs",
  "net",
  "tls",
  "child_process",
  "http2",
  "os",
  "path",
  "url",
  // ... add any other standard node modules reported as missing
];

// This dynamically replaces the import with a null module in the client bundle.
nodeModules.forEach((moduleName) => {
  module.exports[moduleName] = {
    external: `commonjs ${moduleName}`,
  };
});
