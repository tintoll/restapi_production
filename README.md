restapi


- .env 파일 설정 
```javascript
// express에 대한 모든 디버깅 값 출력
DEBUG=express:*

// 내가만든 것만 디버깅 값 출력 
DEBUG=restapi:server
```

> Express는 사실 미들웨어 프레임워크라고 봐도 된다. 시작과 끝이 미들웨어이기 때문이다.

> 미들웨어 함수는 요청객체(req), 응답객체(res), 그리고 다음 미들웨어를 실행하는 next 함수로 이루어져 있다. 즉 클라이언트 요청을 처리하여 응답하는 과정사이에 거쳐가는 함수를 미들웨어라고 한다. 
> 미들웨어는 순처적으로 실행되므로 문서가 매우 중요하다.



> 실시간으로 babel-node 완 bacel-register를 통해 트랜스파일이 진행되기는 하지만, babel 공식 문서에도 나왔듯니 production목적으로 개발된 것이 아니기므로 babel-cli를 통해 트랜스파일 후 실행하는 것을 권고한다. 

> Node.js 기반 서버는 싱글 스레드이며 에러에 굉장히 취약한 점을 가지고 있다. 다른 서버와는 달리 Node.js는 첫 실행될때 메모리 위에 상주하는'실행형' 서버이기 때문에 처리하지 못하는 에러가 발생하였을 경우에 프로세스 자체가 죽어버린다. 그래서 에러 핸들링이 잘되어 있어야 한다. express-cli로 시작하면 어느정도 중앙에서 에러핸들링이 되어있어서 크게 신경쓸필요는 없다.

- 에러핸들링에 대한 많은 개발자들 의견이 들어간 best practice 주소 : https://github.com/i0natan/nodebestpractices#2-error-handling-practices

