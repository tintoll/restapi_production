class Wrapper {
  constructor(obj) {
    if (obj instanceof Object) {
      // Object.assign 객체를 병합해주는 역할을 한다. 
      // 첫번째 인자에 병합하기때문에 첫번째 인자의 값이 변하게 된다. 
      Object.assign(this, obj.toJSON());
    } else {
      Object.assign(this, JSON.parse(obj));
    }
  }

  static create(obj) {
    if(!obj) {
      return null;
    }
    return new Wrapper(obj);
  }

  toJSON() {
    return this;
  }

  toWeb() {
    return this;
  }
}

export default Wrapper