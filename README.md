# 🗂️ Taskify

Vanilla JS 환경에서 컴포넌트 기반 설계 및 상태 관리 학습을 위해 제작한 간단한 Kanban Task 관리 애플리케이션입니다.

## 🚀 프로젝트 구조
```
taskify/
├── bin/                  # 실행 및 서버 구동 스크립트
└── src/
    ├── config/           # 환경 및 DB 설정
    ├── controller/       # 요청별 컨트롤러
    ├── model/            # DB 스키마 및 모델
    ├── public/
    │   ├── css/          # 정적 CSS 파일
    │   ├── img/          # 이미지
    │   └── js/
    │       ├── apis/         # API 통신 모듈
    │       ├── components/  # 화면별 컴포넌트
    │       ├── constants/   # 상수
    │       ├── core/        # 웹 컴포넌트 기반 구조의 핵심 로직
    │       │   ├── Component.js
    │       │   └── Store.js
    │       ├── stores/      # 전역 상태 관리
    │       ├── App.js       # 메인 App 컴포넌트
    │       ├── login.js     # 로그인 진입 파일
    │       └── main.js      # 메인 페이지 진입 파일
    ├── routes/           # API/페이지 라우팅
    ├── utils/            # 유틸리티 함수
    └── views/            # 템플릿 뷰 파일

```

## 🛠️ 주요 기능
- Task 생성/조회/수정/삭제
- Kanban Board Drag & Drop 상태 변경
- 로그인/세션 기반 인증
- Vanilla JS 환경에서 컴포넌트 기반 UI 설계
- 자체 구현한 전역 상태 관리(Store) 적용
- RESTful API 연동

## ⚙️ 핵심 기술: core/Component.js

Taskify는 Vanilla JS 환경에서 컴포넌트 기반 아키텍처를 직접 구현하여 적용합니다.

core/Component.js는 다음과 같은 기능을 제공합니다:
- setup(): 초기 state 설정
- render(): template()으로 HTML 렌더링 및 mounted() 실행
- setState(): 상태 업데이트 및 자동 렌더링
- addEvent(): Event Delegation 기반 이벤트 핸들링

```js
export default class Component {
  constructor($target, props) { ... }
  setup() { }
  template() { return ""; }
  render() { ... }
  mounted() { }
  setEvent() { }
  setState(newState) { ... }
  addEvent(eventType, selector, callback) { ... }
}
```
모든 컴포넌트들은 해당 컴포넌트를 상속받아 사용합니다.

React처럼 상태 기반으로 화면을 업데이트하며, 라이브러리 없이 상태 변화 → UI 반영 → 이벤트 위임까지 직접 구현 및 학습할 수 있습니다.

## ⚡ 설치 및 실행
```
git clone <repo-url>
cd taskify
npm install
npm start
```
`http://localhost:3000` 접속 후 사용 가능합니다.
