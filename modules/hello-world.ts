import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  /**
   * Use the log property on context to enjoy
   * logging magic when testing your API.
   */
  context.log.info(`Hi, from inside your zup!`);

  return "What zup?";
}
