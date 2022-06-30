/** @type {import('next').NextConfig} */
const i18n = require('./i18n.json');

if (process.env.APP_ENV === 'testing') {
	require('dotenv').config({
		path: './.env.testing',
		override: true
	})
}

if (process.env.APP_ENV === 'beta') {
	require('dotenv').config({
		path: './.env.beta',
		override: true
	})
}

if (process.env.APP_ENV === 'production') {
	require('dotenv').config({
		path: './.env.production',
		override: true
	})

	require('dotenv').config({
		path: './.env.production.local',
		override: true
	})
}

module.exports = {
	reactStrictMode: true,
	trailingSlash: true,
	i18n,
  redirects: async () => {
    return [
			{
				source: '/',
				destination: '/projects/',
				permanent: true
			}
    ]
  },
	env: {
		NEXT_PUBLIC_APP_ENV: process.env.APP_ENV
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.plugins.push(new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/(?!(en))(.+)$/,
			contextRegExp: /validatorjs\/src\/lang/
		}));

		return config;
	}
};
