import fs from "fs";
import path from "path";

const Sequalize = require('sequelize');
const config = require(__dirname + '/../configs/sequelize.js')[process.env.NODE_ENV];

// __filename은 현재 파일은 디렉토리및 파일명까지를 가져옵니다.
// __dirname은 현재 디렉토리를 가져옵니다.
const basename = path.basename(__filename);


const models = {};

let sequelize;

if(config.use_env_variable) {
  sequelize = new Sequalize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequalize(config.database, config.username, config.password, config);
}


fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9) === '.model.js'))
  .forEach( file => {
    const model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });


// sequelize에서는 모델을 정의하는 파일에서 관계 설정에 대한 정의도 해야 합니다.
// 아래문장에서 모든 모델들 간의 관계를 통합해준다.
Object.keys(models).forEach(modelName => {
  if(models[modelName].associate) {
    models[modelName].associate(models);
  }
});  

models.sequelize = sequelize;
models.Sequalize = Sequalize;

export {
  models
}