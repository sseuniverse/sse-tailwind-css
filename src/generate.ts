import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Config } from "./types";

// Function to resolve a file with various extensions
function resolveFileWithExtensions(
  filePath: string,
  extensions: string[]
): string {
  for (const ext of extensions) {
    const fullPath = filePath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  throw new Error(
    `File not found for path: ${filePath} with extensions: ${extensions.join(
      ", "
    )}`
  );
}

const configFileBase = path.resolve(process.cwd(), "ssecs.config");
const configFile = resolveFileWithExtensions(configFileBase, [
  ".js",
  ".ts",
  ".mjs",
  ".cjs",
]);

// Load configuration with type assertion
const config: Config = require(configFile);
let outputCSS: string;

if (config.output?.entryFileNames) {
  outputCSS = path.resolve(
    config.output?.dir || process.cwd(),
    config.output?.entryFileNames
  );
} else {
  outputCSS = path.resolve(config.output?.dir || process.cwd(), "output.css");
}

// Generate the Tailwind CSS file
const tailwindContent = config.files
  .map((file: string) => `./${file}`)
  .join(", ");

const tailwindConfig = `
module.exports = {
  content: [${tailwindContent}],
  theme: {
    extend: ${JSON.stringify(config.extends || {}, null, 2)},
  },
  plugins: [${(config.plugins || [])
    .map((plugin) => `'${plugin}'`)
    .join(", ")}],
};
`;

fs.writeFileSync("tailwind.config.js", tailwindConfig);

// Run the Tailwind CLI to generate the CSS
try {
  execSync(
    `npx tailwindcss -o ${outputCSS} ${
      config.output?.minify ? "--minify" : ""
    }`,
    { stdio: "inherit" }
  );

  // Prepend the comment to the generated CSS file
  const comment = `/* THIS IS GENERATED BY SSE-TAIL-CSS */\n`;
  const originalCSS = fs.readFileSync(outputCSS, "utf-8");
  fs.writeFileSync(outputCSS, comment + originalCSS);

  console.log(`Generated CSS file at ${outputCSS}`);
} catch (error) {
  console.error("Error generating CSS:", error);
  process.exit(1);
} finally {
  // Clean up the temporary config file
  fs.unlinkSync("tailwind.config.js");
}
