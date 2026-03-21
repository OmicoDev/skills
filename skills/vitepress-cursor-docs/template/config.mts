// Copy to docs/.vitepress/config.mts. Set title, description, and themeConfig.socialLinks.
// themeConfig.nav routes must match generate-docs.mjs output (defaults below).
import { defineConfig } from "vitepress";
import generatedSidebar from "./sidebar.generated.mts";

export default defineConfig({
  base: "/",
  srcDir: "src",
  title: "Documentation",
  description: "Documentation generated from Cursor rules, commands, and skills.",
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/OWNER/REPO" },
    ],
    nav: [
      { text: "Home", link: "/" },
      { text: "Agent skills", link: "/agent-skills/" },
      { text: "Cursor commands", link: "/cursor-commands/" },
      { text: "Cursor rules", link: "/cursor-rules/" },
    ],
    sidebar: generatedSidebar,
  },
});
