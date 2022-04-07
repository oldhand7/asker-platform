/** @type {import('next').NextConfig} */
const i18n = require('./i18n.json');

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
  }
};
