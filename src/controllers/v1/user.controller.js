import { models } from "../../models";

const get = async (req, res, next) => {
  try {
    const users = await models.User.findAll();
    
    return res.json(users);
  } catch (e) {
    // 에러가 나면 app.js의 error handler 부분으로 호출된다.
    next(e);
  }
}

export {
  get
}
