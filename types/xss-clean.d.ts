// types/xss-clean.d.ts

declare module "xss-clean" {
  import { RequestHandler } from "express";
  // `xss-clean` is basically a middleware returning a RequestHandler
  const xssClean: () => RequestHandler;
  export default xssClean;
}
