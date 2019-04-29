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
  'config' : path.resolve('config', 'sequelize.js'),
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
에러가 발생시( ERROR: Dialect needs to be explicitly supplied as of v4.0.0) - NODE_ENV에 대한 부분이 정의되지 않아서 그렇다.
```shell
echo $NODE_ENV
export NODE_ENV=development
```

##### Sequelize 시딩
- 초기 데이터값을 코드로 간편하게 미리 생성할 수 있는 seed 기능
```shell
// 파일 생성
sequelize seed:generate --name seed-users

// 데이터 만들기
sequelize db:seed:all
```


#### UUID4
- DB의 PK를 auto increment값으로 사용한다. 문제는 생성된 PK를 그대로 url과 같은 공개된 장소에 노출시킨다는 것이다. 이러면 보안에 취약할 수 박에 없다. 그렇기 때문에 클라이언트가 접근할 수 없는 서버 소스단에는 auto increment PK값으로 데이터에 접근하고 public 한 클라이언트 단에서는 예측 불가능하고 random한 index 체계를 사용하는 것이 좋다. 

##### UUID란
- UUID(범용 고유 식별자)는 네트워크 상에서 서로 모르는 객체들을 식별하고 구별하기 위해 각각의 고유한 이름을 부여하기 위해 고안된 기술
- UUID에는 여러가지 종류가 존재하지만 timestamp기반으로 생성하는 UUID4가 가장 많이 사용합니다.

##### UUID 구조
```javascript
const uuid4 = require('uuid4');
uunid4(); // 2851530c-4949-46df-bfc3-3374e7898f7f
```
- UUID는 총 32개의 16진수 문자열과 4개의 '-'를 사용해 연결되어 있습니다.
- UUID값을 순수하게 저장하기 위해선 string형태로 저장해야 하는데 DB에서 string 데이터를 인덱싱 하는 것은 절대로 비추입니다. 인덱스도 비정상적으로 커질뿐 아니라, 실제로 검색 성능도 많이 떨어지기때문이다. 

- UUID계열 값과 인덱싱 가능하고 순서를 보장받는 체계로 변경해야하는 방법 
  - https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/
  - 요약하자면 UUID의 구조르 아래와 같이 변경하면 인덱싱이 가능한, 순서를 '어느정도' 보장받는 수 체계로 변환할수 있다는 내용입니다. 
  > 1-2-3-4-5  ----> 32145
  > 2851530c-4949-46df-bfc3-3374e7898f7f --> 46df49492851530cbfc33374e7898f7f



#### Jest
- Nodejs에는 수많은 테스팅 프레임워크가 존재한다. Mocha, Chai, Should, Jest 등. 여기서는 테스팅의 종합선물세트라고 불리는 Jest를 사용해 테스팅 환경을 구축해보자 

```shell
npm install jest

npm install --save-dev babel-jest regenerator-runtime babel-core@^7.0.0-bridge.0
```