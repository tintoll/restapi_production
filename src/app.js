require('dotenv').config()

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import logger from 'morgan';
import indexRouter from './routes/index';
import v1Route from "./routes/v1";
import response from './utils/response';
import jwtMiddleware from "./middlewares/jwt.middleware";


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// 컨트롤러를 타기전에 jwt로부터 user를 조회
app.use(jwtMiddleware);
app.use('/v1', v1Route);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let apiError = err;
  if(!err.status) {
    apiError = createError(err);
  }

  // set locals, only providing error in development
  res.locals.message = apiError.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {};
  // render the error page
  return response(res, {
    message: apiError.message
  }, apiError.status);
});

// bin/www 를 그대로 사용하기 위해서 예외적으로 commonJs 문법을 적용
module.exports = app;
