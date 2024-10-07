# 웹소켓 게임만들기 (DINO)

---

## 파일 구조

```
📦ROOT
 ┣ 📂public
 ┃ ┣ 📂.idea
 ┃ ┃ ┣ 📜.gitignore
 ┃ ┃ ┣ 📜misc.xml
 ┃ ┃ ┣ 📜modules.xml
 ┃ ┃ ┣ 📜public.iml
 ┃ ┃ ┗ 📜workspace.xml
 ┃ ┣ 📂assets                  - 데이터 테이블에 관련된 파일 모임
 ┃ ┃ ┣ 📜item.json    
 ┃ ┃ ┣ 📜item_unlock.json
 ┃ ┃ ┗ 📜stage.json
 ┃ ┣ 📂images
 ┃ ┃ ┣ 📂items
 ┃ ┃ ┃ ┣ 📜pokeball_cyan.png
 ┃ ┃ ┃ ┣ 📜pokeball_orange.png
 ┃ ┃ ┃ ┣ 📜pokeball_pink.png
 ┃ ┃ ┃ ┣ 📜pokeball_purple.png
 ┃ ┃ ┃ ┣ 📜pokeball_red.png
 ┃ ┃ ┃ ┗ 📜pokeball_yellow.png
 ┃ ┃ ┣ 📜cactus_1.png
 ┃ ┃ ┣ 📜cactus_2.png
 ┃ ┃ ┣ 📜cactus_3.png
 ┃ ┃ ┣ 📜dino_run1.png
 ┃ ┃ ┣ 📜dino_run2.png
 ┃ ┃ ┣ 📜ground.png
 ┃ ┃ ┣ 📜happy_rtan.gif
 ┃ ┃ ┣ 📜sprite_sheet.png
 ┃ ┃ ┣ 📜standing_still.png
 ┃ ┃ ┗ 📜standing_still_eye_closed.png
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜Assets.js
 ┃ ┣ 📜CactiController.js
 ┃ ┣ 📜Cactus.js
 ┃ ┣ 📜config.js
 ┃ ┣ 📜Constants.js
 ┃ ┣ 📜Ground.js
 ┃ ┣ 📜index.html
 ┃ ┣ 📜index.js
 ┃ ┣ 📜Item.js
 ┃ ┣ 📜ItemController.js
 ┃ ┣ 📜Player.js
 ┃ ┣ 📜Score.js
 ┃ ┣ 📜Socket.js
 ┃ ┗ 📜style.css
 ┣ 📂src                       - 서버 관련 스크립트 모임
 ┃ ┣ 📂handlers                - 소켓 아이디를 관리하기 위한 스크립트 모임
 ┃ ┃ ┣ 📜game.handler.js          - 게임 관련 핸들러 로직 대한
 ┃ ┃ ┣ 📜handlerMapping.js        - 핸들러 이벤트 매핑
 ┃ ┃ ┣ 📜helper.js                - 핸들러 이벤트가 작동할 때 도움을 주는 함수들 모임
 ┃ ┃ ┣ 📜item.handler.js          - 아이템 관련 핸들러 로직
 ┃ ┃ ┣ 📜rank.hanlder.js          - 랭크 관련 핸들러 로직
 ┃ ┃ ┣ 📜register.handler.js      - 계정 관련 핸들러 로직
 ┃ ┃ ┗ 📜stage.handler.js         - 스테이지 관련 핸들러 로직
 ┃ ┣ 📂init                    - 서버가 실행되면 자동으로 초기화 및 실행시켜주는 스크립트 모임
 ┃ ┃ ┣ 📜assets.js                - 에셋을 불러오는 파일
 ┃ ┃ ┗ 📜socket.js                - 소켓에 서버를 연결하고 핸들러를 등록하는 파일
 ┃ ┣ 📂models                  - 서버에서 사용할 데이터 모델 스크립트 모임
 ┃ ┃ ┣ 📜item.model.js               
 ┃ ┃ ┣ 📜rank.model.js
 ┃ ┃ ┣ 📜record.model.js
 ┃ ┃ ┣ 📜stage.model.js
 ┃ ┃ ┗ 📜user.model.js
 ┃ ┣ 📂services
 ┃ ┃ ┗ 📜validation.js         - 각종 검증 함수 스크립트 모임
 ┃ ┣ 📜app.js
 ┃ ┗ 📜constants.js
 ┣ 📜.gitattributes
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜Dockerfile.dev            - 도커 이미지 생성 파일
 ┣ 📜package.json
 ┣ 📜readme.md
 ┗ 📜yarn.lock
```

---
