export interface OutputOptions {
  dir?: string;
  entryFileNames?: string;
  sourcemap?: boolean;
  minify?: boolean;
}

export interface Config {
  files: string[];
  output?: OutputOptions;
  extends?: Record<string, any>;
  plugins?: string[];
}
