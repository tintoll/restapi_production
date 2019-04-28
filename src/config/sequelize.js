require('dotenv').config();

if(process.env.NODE_ENV !== 'production') {
  // @bebel/register 각각의 모듈을 결합할 때 사용되는 후크(Hook) 모듈입니다
  require('@babel/register');
}

const baseDbSetting = {
  username : process.env.DB_USER,
  password: process.env.DB_PW,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone : '+09:00',
  pool : {
    max : 100,
    min : 0,
    idel : 10000
  },
  define : {
    charset : 'utf8mb4',
    collate : 'utf8mb4_unicode_ci',
    timestamps : true
  }
}

// Object.assign({}, ...source) : 객체를 병햅해주는 함수(첫번째인자에 이후 인자들의값들을 병합해줌.)
module.exports = {
  production : Object.assign({
    database : process.env.DB_NAME,
    logging : false,
  }, baseDbSetting),
  
  development : Object.assign({
    database: process.env.DB_DEV,
    logging: true,
  }, baseDbSetting),

  test : Object.assign({
    database: process.env.DB_TEST,
    logging: false,
  }, baseDbSetting),
}

