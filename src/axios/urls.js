const Config = {
  prod: 'http://pay81.phtonspark.com', //Production
  uat: 'http://pay81.phtonspark.com', //UAT
  sit: 'http://119.29.155.236', //SIT
  dev: 'http://localhost:9000' //DEV
};

const REQUEST_URL = Config[process.env.ENV_CONFIG];

const Url = {
  baseUrl: `${REQUEST_URL}/api`,

  /**资源路径 */
  asserts: `${REQUEST_URL}/asserts`
};
export default Url;