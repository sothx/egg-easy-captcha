'use strict';

const COMMON = {
  SUCCESS: '000000', // 请求成功
  VALIDATOR_ERROR: '100000', // 验证码校验未通过
  HAS_EXPIRE: '200000', // 验证码已过期
};

module.exports = {
  COMMON,
};
