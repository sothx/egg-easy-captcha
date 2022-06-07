'use strict';
// 验证码uuid
const { v1: uuidv1 } = require('uuid');
const assert = require('assert');
const createCaptcha = function(type, inputOptions) {
  // 如果没传入类型，则退出
  if (!type) {
    assert(type, 'captcha type error');
    return false;
  }
  const typeMap = {
    image: this.captchaService.create,
    mathExpr: this.captchaService.createMathExpr,
  };
  const captcha = typeMap[type] && typeMap[type](inputOptions);
  // 如果没有效的验证码类型，则退出
  if (!captcha) {
    assert(captcha, 'captcha type method error');
    return false;
  }
  const uuid = uuidv1();
  this.redisService.set(`${inputOptions.redisKey}:${uuid}`, captcha.text, 'PX', inputOptions.pexpire);
  return {
    id: uuid,
    ...captcha,
  };
};
module.exports = createCaptcha;
