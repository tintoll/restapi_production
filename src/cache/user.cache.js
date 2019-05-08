const redis = require('redis');
const bluebird = require('bluebird');

class UserCache  {

  constructor() {
    this.client = redis.createClient();
    this.client.on('connect', () => {
      // redis의 모든 함수를 promisify
      bluebird.promisifyAll(this.client);
    });

    this.client.on('error', (e) => {
      console.error(`redis error : ${e}`);
    })
  } 

  async store(user) {
    try {
      await client.hsetAsync('users:id', [user.id, user.uuid]);
      await client.hsetAsync('users:email', [user.email, user.uuid]);
      await client.hsetAsync('users:uuid', [user.uuid, JSON.stringify(user.toJSON())]);
    } catch(e) {
      // error 로깅
    }
  }

  async find(uuid) {
    if (uuid) {
      try {
        const user = await client.hgetAsync('users:uuid', `${uuid}`);

        if(!user) {
          return null;
        }

        // user정보를 자바스크립트 객체로 변환하여 반환합니다.
        return JSON.parse(user);
      } catch(e) {
        // error 로깅
        return null;
      }
      
    }
    return null;
  }
  
  async findById(id) {
    if (id) {
      try {
        const uuid = await this.client.hgetAsync('users:id', id)
        return this.find(uuid)
      } catch (e) {
        // error 로깅
        return null;
      }
    }
    return null;
  }

  async findByEmail(email) {
    if (email) {
      try {
        const uuid = await this.client.hgetAsync('users:email', email)
        return this.find(uuid)
      } catch (e) {
        // error 로깅
        return null;
      }
    }
    return null;
  }
}




export default UserCache;