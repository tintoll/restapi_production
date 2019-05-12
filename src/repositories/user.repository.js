import models from "../models";
import UserCache from '../cache/user.cache';
import UserWrapper from '../wrappers/user.wrapper';


class UserRepository {
  constructor() {
    this.userCache = new UserCache();
  }
  // CREATE
  async store(data) {
    const user = await models.User.create(data);
    await this.userCache.store(user);
    return UserWrapper.create(user);
  }

  // READ
  async all() {
    const users =  await models.User.findAll();
    return users.map(user => UserWrapper.create(user));
  }

  // 한 함수가 여러가지의 반환값을 가지게 되고 이 함수들이 서로를 복잡하게 참조하다보면
  // 그때부터 아주 큰 문제가 생기기 시작하고, 이를 해결하기 위해 누더기 코드를 작성 해야만 합니다.
  async find(uuid) {
    let user = await this.userCache.find(uuid);
    if(!user) {
      // Cache가 존재하지 않으면 DB에서 받아옴
      user =  await models.User.findOne({
        where: {
          uuid: Buffer(uuid, 'hex')
        }
      }) // sequelize 객체 반환

    }
    return UserWrapper.create(user);
  }

  async findById(id) {
    let user = await this.userCache.findById(id);

    if (!user) {
      user = await models.User.findByPk(id);
    }
    
    return UserWrapper.create(user);
  }

  async findByEmail(email) {
    let user = await this.userCache.findByEmail(email);

    if (!user) {
     user = await models.User.findOne({
        where: {
          email,
        }
      });
    }

    return UserWrapper.create(user);
  }

  // UPDATE

  // DELETE

}

export default UserRepository