# egg-easy-captcha

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-easy-captcha.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-easy-captcha
[travis-image]: https://img.shields.io/travis/sothx/egg-easy-captcha.svg?style=flat-square
[travis-url]: https://travis-ci.org/sothx/egg-easy-captcha
[codecov-image]: https://img.shields.io/codecov/c/github/sothx/egg-easy-captcha.svg?style=flat-square
[codecov-url]: https://codecov.io/github/sothx/egg-easy-captcha?branch=master
[david-image]: https://img.shields.io/david/sothx/egg-easy-captcha.svg?style=flat-square
[david-url]: https://david-dm.org/sothx/egg-easy-captcha
[snyk-image]: https://snyk.io/test/npm/egg-easy-captcha/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-easy-captcha
[download-image]: https://img.shields.io/npm/dm/egg-easy-captcha.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-easy-captcha

<!--
Description here.
-->

## Install

```bash
$ npm i egg-easy-captcha --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.easyCaptcha = {
  enable: true,
  package: 'egg-easy-captcha',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
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
  }
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->
### 获取图形验证码
```js
  /**
   * 获取图形验证码
   */
  async getImageCaptcha() {
    const ctx = this.ctx;
    const { constant } = this.app;
    const { statusCode } = constant;
    // 限制接口访问频率
    const limit = await ctx.Limit({ max: 6, time: '60s' })
    if (limit) {
      ctx.body = {
        statusCode:statusCode.COMMON.IP_LIMIT_ERROR
      }
      return;
    }
    // 获取图形验证码
    const imageCaptcha = this.app.easyCaptcha.create()
    if (!imageCaptcha) {
      ctx.body = {
        statusCode: statusCode.COMMON.CAPTCHA_SYSTEM_ERROR
      }
      return;
    }
    // 将图形验证码进行返回
    ctx.set('Content-Type', 'image/svg+xml')
    ctx.set('captcha-validate-id', imageCaptcha.id);
    ctx.body = imageCaptcha.data
  }
```
### 验证图形验证码
```js
  /**
   * 验证图形验证码
   */
  async validateImageCaptcha() {
    const ctx = this.ctx;
    const { constant } = this.app;
    const { statusCode } = constant;
    const { captchaText } = ctx.qeury;
    // 验证图形验证码
    const validateCaptcha = await this.app.easyCaptcha.validate(ctx.get('captcha-validate-id'),captchaText);
    // 如果没法正常校验，则返回错误
    if (!validateCaptcha) {
      ctx.body = {
        statusCode: statusCode.COMMON.CAPTCHA_SYSTEM_ERROR
      }
      return;
    }
    switch (validateCaptcha.status) {
      case 'SUCCESS': {
        ctx.body = {
          statusCode: statusCode.COMMON.SUCCESS
        }
        break;
      }
      default: {
        ctx.body = {
          statusCode: statusCode.COMMON.CAPTCHA_FAIL
        }
      }
    }
  }
```


## Questions & Suggestions

Please open an issue [here](https://github.com/sothx/egg-easy-captcha/issues).

## License

[MIT](LICENSE)
