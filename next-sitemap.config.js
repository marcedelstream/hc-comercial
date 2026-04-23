/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://hccomercial.com.py",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/api/*"],
};
