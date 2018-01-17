const Config = {
    prod: 'http://pay81.phtonspark.com', //Production
    uat: 'http://pay81.phtonspark.com', //UAT
    sit: 'http://10.81.1.65:9030', //SIT
    dev: 'http://10.81.1.65:9030' //DEV
}

const REQUEST_URL = Config[process.env.ENV_CONFIG];

const Url = {
    baseUrl: `${REQUEST_URL}/sessions`,

    /**资源路径 */
    asserts: `${REQUEST_URL}/asserts`,
};
export default Url;