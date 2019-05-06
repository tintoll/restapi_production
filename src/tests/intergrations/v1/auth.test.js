import request from "supertest";
import randomString from "random-string";
import models from "../../../models";
import userRepo from "../../../repositories/user.repository";
import jwt from "jsonwebtoken";

const app = require('../../../app');

afterAll( () => models.sequelize.close() );

describe('로그인 테스트 ', () => {
  let userData;
  let token;

  beforeAll(async () => {
    userData = {
      email : randomString() + '@test.com',
      password : randomString()
    }

    // 테스트용 사용자 생성
    await userRepo.store(userData);
  });

  test('실제 로그인 테스트. | 200', async () => {
    let response = await request(app).post('/v1/auth/login')
      .send({
        email : userData.email,
        password : userData.password
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.token).toBeTruthy();

    const payload = jwt.verify(response.body.data.token, process.env.JWT_SECRET);
    expect(userData.email).toBe(payload.email);

    const user = await userRepo.find(payload.uuid);
    expect(userData.email).toBe(user.email);

    token = response.body.data.token;
    console.log(payload);

  });

  test('없는 사용자 로그인. | 404', async () => {
    let response = await request(app).post('/v1/auth/login')
      .send({
        email: 'empty@empty.com',
        password: 'pass'
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.data.message).toBe('사용자를 찾을 수 없습니다.');
  });

  test('잘못된 비밀번호로 로그인. | 422', async () => {
    let response = await request(app).post('/v1/auth/login')
      .send({
        email: userData.email,
        password: 'pass'
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.data.message).toBe('비밀번호를 확인 해주세요');
  });

  test('token으로 사용자 조회 | 200', async () => {
    let response = await request(app).get('/v1/auth/tokenTest')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.email).toBe(userData.email);
    console.log(response.body.data);  
  })

});