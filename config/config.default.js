'use strict';

/**
 * egg-easy-captcha default config
 * @member Config#easyCaptcha
 * @property {String} SOME_KEY - some description
 */
exports.easyCaptcha = {
  client: {
    // 验证码宽度
    width: 150,
    // 验证码高度
    height: 50,
    // 字体大小
    fontSize: 56,
    // 预置格式化字符
    charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    // 干扰线条的数量
    noise: 1,
    // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    color: false,
    // 验证码图片背景颜色
    background: '',
    // 加载字体，覆盖内置的字体。
    loadFont: '',
    // 验证码默认有效期(ms单位),默认10分钟
    pexpire: 600000,
    // 配置默认使用redis的Key
    redisKey: 'eggEasyCaptcha',
  },
};
