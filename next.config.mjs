/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your existing image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        // CRITICAL FIX: Allow ANY pathname, as signed URLs have dynamic paths
        pathname: "/**",
      },
      // 2. Firebase Storage Default Domain (for files linked via the v0/b/ path)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        // Allow ANY pathname, covering both bucket and object access methods
        pathname: "/**",
      },
    ],
  },

  // webpack: (config, { isServer }) => {
  //   // 1. --- CLIENT-SIDE FALLBACKS (Fixes standard Node module references) ---
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       // Existing fallbacks (fs, net, tls, etc.)

  //       // CRITICAL: Aliases for the 'node:' protocol modules
  //       "node:events": false, // Add alias mapping for 'node:events'
  //       "node:process": false,
  //       "node:stream": false,
  //       "node:util": false,

  //       fs: false,
  //       net: false,
  //       tls: false,
  //       child_process: false,
  //       http2: false,
  //       os: false,
  //       path: false,
  //       crypto: false,
  //       events: false,
  //       process: false,
  //       stream: false,
  //       util: false, // Legacy fallbacks
  //     };
  //   }

  //   // 2. --- SERVER-SIDE EXTERNALIZATION ---
  //   if (isServer) {
  //     config.externals = [
  //       ...(config.externals || []),
  //       // Explicitly externalize all packages (as before)
  //       "firebase-admin",
  //       "@google-cloud/storage",
  //       "gtoken",
  //       "google-auth-library",
  //       "gcp-metadata",
  //       "http-proxy-agent",
  //       "https-proxy-agent",
  //       "teeny-request",
  //       "agent-base",

  //       // CRITICAL: Keep the specific 'node:' protocol externalization for the server
  //       {
  //         "node:events": "commonjs node:events",
  //         "node:process": "commonjs node:process",
  //         "node:stream": "commonjs node:stream",
  //         "node:util": "commonjs node:util",
  //       },
  //     ];
  //   }

  //   return config;
  // },
};

// CRITICAL FIX: Use the ES Module export syntax to avoid the ReferenceError: module is not defined
export default nextConfig;
