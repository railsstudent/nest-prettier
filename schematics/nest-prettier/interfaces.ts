export interface EslintOptions {
  eslintExtend?: string;
  plugin?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: Record<string, any>;
}
