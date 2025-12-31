const { themes: prismThemes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Nidhara",
  tagline:
    "Nidhara is your personal sanctuary for managing finances, personal growth, and life in one secure, fluid platform.",
  favicon: "img/Nidhara_s_transparent.png",

  future: {
    v4: true,
  },

  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  organizationName: "marceldavidbaroi",
  projectName: "Nidhara-",

  onBrokenLinks: "throw",

  // Mermaid theme (package MUST be installed)
  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig: {
    image: "img/Nidhara_s_transparent.png",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Nidhara",
      logo: {
        alt: "Nidhara Logo",
        src: "img/Nidhara_s_transparent.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/marceldavidbaroi/Nidhara-",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `Copyright © ${new Date().getFullYear()} Nidhara.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  themes: ["@docusaurus/theme-mermaid"],
  // In order for Mermaid code blocks in Markdown to work,
  // you also need to enable the Remark plugin with this option
  markdown: {
    mermaid: true,
  },
};

module.exports = config;
