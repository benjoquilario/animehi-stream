/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["s4.anilist.co", "gogocdn.net", "images.weserv.nl"],
  },
<<<<<<< HEAD
};
=======
  i18n: {
    locales: ["en-US", "fr", "nl-NL", "nl-BE"],
    defaultLocale: "en-US",
  },
}
>>>>>>> acb100751ed9164d69eea380ae006c2854ab946c

module.exports = nextConfig
