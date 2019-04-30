'use strict'
import { uuid } from "../utils/uuid";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      uuid: {
        allowNull: false,
        unique: true,
        type: "BINARY(16)",
        // defaultValue 로 uuid() 로 부터 생성된 hex 문자열을 Byte Buffer 로 변환시켜서 넣는 걸 확인하실 수 있습니다. 
        // 이는 곧 mysql 에서 unhex() 하는 것과 같은 결과를 낳습니다.
        defaultValue: () => Buffer(uuid(), "hex"),
        get: function() {
          return Buffer.from(this.getDataValue("uuid")).toString("hex");
        }
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      password: {
        alloNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableNames: "users",
      timestamps: true
    }
  );

  User.associate = function (models) {
    // associations
  }

  // hooks

  return User;
}