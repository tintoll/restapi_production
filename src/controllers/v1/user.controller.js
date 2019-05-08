import httpStatus from "http-status";
import createError from "http-errors";
import UserRepo from "../../repositories/user.repository";

const userRepo = new UserRepo();
const get = async (req, res, next) => {
  try {

    if(req.params.uuid) {
      const user = await userRepo.find(req.params.uuid);

      if(!user) {
        throw (createError(httpStatus.NOT_FOUND, '사용자를 찾을 수 없습니다.'));
      }
      return res.status(httpStatus.OK).json(user.toWeb());

    } else {
      const users = await userRepo.all();
      return res.json(users.map( user => user.toWeb()));
    }

  } catch (e) {
    // 에러가 나면 app.js의 error handler 부분으로 호출된다.
    next(e);
  }
}

export {
  get
}
