restapi


- .env 파일 설정 
```javascript
// express에 대한 모든 디버깅 값 출력
DEBUG=express:*

// 내가만든 것만 디버깅 값 출력 
DEBUG=restapi:server
```

> Express는 사실 미들웨어 프레임워크라고 봐도 된다. 시작과 끝이 미들웨어이기 때문이다.

> 미들웨어 함수는 요청객체(req), 응답객체(res), 그리고 다음 미들웨어를 실행하는 next 함수로 이루어져 있다. 즉 클라이언트 요청을 처리하여 응답하는 과정사이에 거쳐가는 함수를 미들웨어라고 한다. 
> 미들웨어는 순처적으로 실행되므로 문서가 매우 중요하다.



> 실시간으로 babel-node 완 bacel-register를 통해 트랜스파일이 진행되기는 하지만, babel 공식 문서에도 나왔듯니 production목적으로 개발된 것이 아니기므로 babel-cli를 통해 트랜스파일 후 실행하는 것을 권고한다. 

> Node.js 기반 서버는 싱글 스레드이며 에러에 굉장히 취약한 점을 가지고 있다. 다른 서버와는 달리 Node.js는 첫 실행될때 메모리 위에 상주하는'실행형' 서버이기 때문에 처리하지 못하는 에러가 발생하였을 경우에 프로세스 자체가 죽어버린다. 그래서 에러 핸들링이 잘되어 있어야 한다. express-cli로 시작하면 어느정도 중앙에서 에러핸들링이 되어있어서 크게 신경쓸필요는 없다.

- 에러핸들링에 대한 많은 개발자들 의견이 들어간 best practice 주소 : https://github.com/i0natan/nodebestpractices#2-error-handling-practices


> mysql 을 사용하기 위해서는 mysql2 패키지를 설치해야한다. mysql은 deprecated 되서 공식 지원중인 mysql2 패키지를 사용해야한다. 

```shell
npm install mysql2
// ORM을 사용하기 위해서 필요한 패키지
npm install sequelize
// cli상에서 sequelize명령어를 사용할수 있게 해주는 패키지
npm install -g sequelize-cli
```

#### Sequelize 설정
sequelize를 환경별로 다른 DB를 사용할 수 있게 유동적으로 설정

```javascript
// .sequelizerc 파일
const path = require('path');

module.exports = {
  'config' : path.resolve('configs', 'sequelize.js'),
  'models-path' : path.resolve('.', 'models'),
  'seeders-path' : path.resolve('.', 'seeders'),
  'migrations-path' : path.resolve('.', 'migrations'),
}
```

- path.resolve([from…], to) : 전달받은 경로의 절대 경로를 리턴합니다

```javascript 
path.resolve('.');
// '/user/node'
path.resolve('../Python34', 'libs');
// '/user/node/Python34/libs'
```


```javascript
// config/sequelize.js
require('dotenv').config();

if(process.env.NODE_ENV !== 'production') {
  // @bebel/register 각각의 모듈을 결합할 때 사용되는 후크(Hook) 모듈입니다
  require('@bebel/register');
}

const baseDbSetting = {
  username : process.env.DB_USER,
  password: process.env.DB_PW,
  host: process.env.DB_HOST,
  timezone : '+09:00',
  dialect : 'mysql',
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
```

##### connection
```javascript
const Sequelize = require('sequelize');
// Option 1: Passing parameters separately
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
// Option 2: Using a connection URI
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
```


##### 관계 설정(associate)
```javascript
// sequelize에서는 모델을 정의하는 파일에서 관계 설정에 대한 정의도 해야 합니다.
// 아래문장에서 모든 모델들 간의 관계를 통합해준다.
Object.keys(models).forEach(modelName => {
  if(models[modelName].associate) {
    models[modelName].associate(models);
  }
});
```
- 참고 url : https://victorydntmd.tistory.com/32


##### 마이그레이션
- DB스키마를 실제로 코드 베이스로 구현하기 위해서는 sequelize에는 migration이라고 하는 기능을 이용하여 DB안에 테이블을 생성해 준다.

```shell
sequelize migration:generate --name create-users
```
위에서 생성된 파일에 테이블에 대한 정보를 작성하여줍니다.

```javascript
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
````
그 다음에 아래 명령어를 입력합니다.
```shell
sequelize db:migrate
```