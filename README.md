# SSE Tailwind CSS Generator Plugin

A versatile plugin that integrates with both Webpack and Rollup to generate a Tailwind CSS file based on your configuration and specified content files. This plugin simplifies the process of incorporating Tailwind CSS into your build workflow.

## Features

- **Multi-Build Tool Support**: Works seamlessly with both Webpack and Rollup.
- **Automatic CSS Generation**: Generates a Tailwind CSS file based on your configuration.
- **Custom Configuration**: Supports custom content files and Tailwind settings.
- **Minification**: Optionally minifies the output CSS file.
- **Plugin Support**: Easily extendable with Tailwind CSS plugins.

## Installation

To install the plugin, run the following command:

```bash
npm install --save-dev sse-tail-css
```

## Usage

> You can skip the first step.

### Webpack

1. **Create a Tailwind CSS configuration file** (e.g., `tailwind.config.js`) in your project root:

```js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customColor: "#1c1c1e",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

2. **Update your Webpack configuration** (e.g., `webpack.config.js`) to include the plugin:

```js
const path = require("path");
const TailwindCssGeneratorPlugin = require("sse-tail-css");

module.exports = {
  entry: "./src/index.js", // Your entry file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new TailwindCssGeneratorPlugin({
      content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
      output: {
        dir: "dist",
        entryFileNames: "styles.css",
        minify: true,
      },
      extend: {
        colors: {
          customColor: "#1c1c1e",
        },
      },
      plugins: ["@tailwindcss/forms", "@tailwindcss/typography"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
```

### Rollup

1. **Create a Tailwind CSS configuration file** (e.g., `tailwind.config.js`) in your project root (same as above).

2. **Update your Rollup configuration** (e.g., `rollup.config.js`) to include the plugin:

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import TailwindCssGeneratorPlugin from "sse-tail-css";

export default {
  input: "src/index.js", // Your entry file
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [
    resolve(),
    commonjs(),
    new TailwindCssGeneratorPlugin({
      content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
      output: {
        dir: "dist",
        entryFileNames: "styles.css",
        minify: true,
      },
      extend: {
        colors: {
          customColor: "#1c1c1e",
        },
      },
      plugins: ["@tailwindcss/forms", "@tailwindcss/typography"],
    }),
    terser(), // Optional: Minify the output bundle
  ],
};
```

## Configuration Options

### `content`

An array of file patterns that Tailwind CSS should scan for class names. This is required.

### `output`

An object specifying the output options:

- `dir`: The directory where the generated CSS file will be saved.
- `entryFileNames`: The name of the generated CSS file.
- `sourcemap`: Generate the source map for the CSS File.
- `minify`: A boolean indicating whether to minify the output CSS.

### `extend`

An object to extend the default Tailwind CSS configuration. You can add custom colors, spacing, and other Tailwind settings.

### `plugins`

An array of Tailwind CSS plugins to include in the configuration.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [Webpack](https://webpack.js.org/) - A module bundler for modern JavaScript applications.
- [Rollup](https://rollupjs.org/) - A module bundler for modern JavaScript applications.

## Customization

Feel free to modify the content to better fit your project's specifics, such as:

- Adding more detailed usage examples.
- Including any additional features or configuration options.
- Providing troubleshooting tips or FAQs if necessary.
- Adding a section for testing or building the project if applicable.

This README provides a solid foundation for users to understand how to install and use your Webpack plugin effectively.
