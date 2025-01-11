import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Twitter Follow Automation",
    version: "1.0",
    description: "Automatically follow users on Twitter/X’s For You tab.",
    permissions: ["tabs", "scripting", "activeTab"],
    background: {
      service_worker: "background.js",
    },
    action: {
      default_popup: "index.html",
      default_title: "Twitter Follow",
    },
  },
});
