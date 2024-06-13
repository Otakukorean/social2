/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images : {
        remotePatterns : [
        {
            hostname : "res.cloudinary.com"
        } ,
        {
            hostname : "lh3.googleusercontent.com"
        }
        ]
    } ,
    eslint : {
        ignoreDuringBuilds : true
    } ,
    typescript : {
        ignoreBuildErrors : true
    }
};

export default config;
