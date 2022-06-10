'use strict';

const _ = require('lodash');
const svgCaptcha = require('svg-captcha');
const createCaptcha = require('./createCaptcha');
const STATUS_CODE = require('./statusCode');
class EasyCaptchaService {
  constructor(config, app) {
    this.config = _.assign({}, config);
    this.app = app;
    this.redisService = this.app.redis;
    this.captchaService = svgCaptcha;
    this.captchaService.options = this.config;
    // 如果默认配置有配置字体，则读取默认字体
    if (config.loadFont) {
      this.captchaService.loadFont(config.loadFont);
    }
  }
  // 多redis服务器实例需要配置时，可以通过此方法配置redis服务器
  configRedisService(inputServiceInstance) {
    this.redisService = inputServiceInstance;
  }
  // 创建图片验证码
  create(inputOptions = {}) {
    const options = _.assign({}, this.config, inputOptions);
    this.captchaService.options = options;
    return createCaptcha.call(this, 'image', options, this.app);
  }
  // 创建数学表达式验证码
  createMathExpr(inputOptions = {}) {
    const options = _.assign({}, this.config, inputOptions);
    this.captchaService.options = options;
    return createCaptcha.call(this, 'mathExpr', options, this.app);
  }
  // 校验验证码
  async validate(inputUuid, inputText) {
    const getCaptchaKeyByRedisDB = await this.redisService.get(`${this.config.redisKey}:${inputUuid}`);
    // 如果不存在，则表示验证码已过期
    console.log(getCaptchaKeyByRedisDB, 'getCaptchaKeyByRedisDB');
    if (!getCaptchaKeyByRedisDB) {
      return Promise.reject({
        code: STATUS_CODE.COMMON.HAS_EXPIRE,
        status: 'HAS_EXPIRE',
        data: {
          uuid: inputUuid,
          text: inputText,
        },
      });
    }
    // 如果存在，则校验结果是否通过
    if (getCaptchaKeyByRedisDB !== inputText) {
      return Promise.reject({
        code: STATUS_CODE.COMMON.VALIDATOR_ERROR,
        status: 'VALIDATOR_ERROR',
        data: {
          uuid: inputUuid,
          text: inputText,
        },
      });
    }
    // 校验结果通过
    return Promise.resolve({
      code: STATUS_CODE.COMMON.SUCCESS,
      status: 'SUCCESS',
      data: {
        uuid: inputUuid,
        text: inputText,
      },
    });
  }
}

const createEasyCaptcha = function(config, app) {
  // 检查入参
  const client = new EasyCaptchaService(config, app);

  return client;
};

module.exports = app => {
  app.addSingleton('easyCaptcha', createEasyCaptcha);
};
