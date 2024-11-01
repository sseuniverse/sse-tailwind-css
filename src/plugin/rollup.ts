import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Plugin } from "rollup";
import { Config } from "../types";

function sseTailCssPlugin(config: Config): Plugin {
  return {
    name: "sse-tail-css",
    buildStart() {
      const configFile = path.resolve(process.cwd(), "ssecs.config.js");

      if (!fs.existsSync(configFile)) {
        this.error("Configuration file ssecs.config.js not found.");
        return;
      }

      // Load configuration
      const userConfig: Config = require(configFile);

      // Determine the output CSS file name
      let outputCSS: string;
      if (userConfig.output?.entryFileNames) {
        outputCSS = path.resolve(
          userConfig.output.dir || process.cwd(),
          userConfig.output.entryFileNames
        );
      } else {
        outputCSS = path.resolve(
          userConfig.output?.dir || process.cwd(),
          "output.css"
        );
      }

      // Generate the Tailwind CSS file
      const tailwindContent = userConfig.files
        .map((file: string) => `./${file}`)
        .join(", ");

      // Create a temporary Tailwind config file
      const tailwindConfig = `
        module.exports = {
        content: [${tailwindContent}],
        theme: {
            extend: ${JSON.stringify(userConfig.extends || {}, null, 2)},
        },
        plugins: [${(userConfig.plugins || [])
          .map((plugin) => `'${plugin}'`)
          .join(", ")}],
        };`;

      fs.writeFileSync("tailwind.config.js", tailwindConfig);

      // Run the Tailwind CLI to generate the CSS
      try {
        execSync(
          `npx tailwindcss -o ${outputCSS} ${
            userConfig.output?.minify ? "--minify" : ""
          }`,
          { stdio: "inherit" }
        );

        // Prepend the comment to the generated CSS file
        const comment = `/* THIS IS GENERATED BY SSE-TAIL-CSS */\n`;
        const originalCSS = fs.readFileSync(outputCSS, "utf-8");
        fs.writeFileSync(outputCSS, comment + originalCSS);

        this.warn(`Generated CSS file at ${outputCSS}`);
      } catch (error) {
        this.error("Error generating CSS: " + error);
      } finally {
        // Clean up the temporary config file
        fs.unlinkSync("tailwind.config.js");
      }
    },
  };
}

export default sseTailCssPlugin;
