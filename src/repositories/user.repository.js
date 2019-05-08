import models from "../models";
import UserCache from '../cache/user.cache';


class UserRepository {
  constructor() {
    this.userCache = new UserCache();
  }
  // CREATE
  async store(data) {
    const user = await models.User.create(data)
    return user.toJSON()
  }

  // READ
  all() {
    return models.User.findAll()
  }

  async find(uuid) {
    const user = await this.userCache.find(uuid);
    if(user) {
      // Cache가 존재할때
      return JSON.parse(user);
    } else {
      // Cache가 존재하지 않으면 DB에서 받아옴
      return models.User.findOne({
        where: {
          uuid: Buffer(uuid, 'hex')
        }
      })
    }
  }

  async findById(id) {
    const user = await this.userCache.findById(id);

    if (user) {
      return JSON.parse(user);
    } else {
      return models.User.findByPk(id);
    }
  }

  async findByEmail(email) {
    const user = await this.userCache.findByEmail(email);

    if (user) {
      return JSON.parse(user);
    } else {
      return models.User.findOne({
        where: {
          email,
        }
      })
    }
  }

  // UPDATE

  // DELETE

}

export default UserRepository