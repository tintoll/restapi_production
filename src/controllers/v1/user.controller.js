const get = (req, res, next) => {
  try {
    return res.json({ message: 'users get' })
  } catch (e) {
    // 에러가 나면 app.js의 error handler 부분으로 호출된다.
    next(e);
  }
}

export {
  get
}
