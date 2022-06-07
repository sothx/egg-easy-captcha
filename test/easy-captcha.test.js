'use strict';

const mock = require('egg-mock');

describe('test/easy-captcha.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/easy-captcha-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, easyCaptcha')
      .expect(200);
  });
});
