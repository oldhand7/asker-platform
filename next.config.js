/** @type {import('next').NextConfig} */
const i18n = require('./i18n.json');

if (process.env.APP_ENV === 'testing') {
	require('dotenv').config({
		path: './.env.testing',
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
	}
};
