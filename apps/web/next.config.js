// const withTM = require("next-transpile-modules")(["ui"]);

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    transpilePackages: ["ui"],
  },
};

// module.exports = withTM({
//   reactStrictMode: true,
//   experimental: {
//     appDir: true,
//     transpilePackages: ["ui"],
//   },
// });
