import { request, config, request_t } from "../utils";

const { api } = config;
const { performanceproxy } = api;

export async function queryES(params) {
  return request({
    url: performanceproxy + params.paths,
    method: "post",
    data: params.es,
  });
}
