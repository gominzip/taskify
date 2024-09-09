export const generateHistoryHTML = (history) => {
  const { action, created_at, before_state, after_state, user_id } = history;
  const userName = `@곰인집`;

  let actionContent;

  switch (action) {
    case 1:
      actionContent = `
          <span class="history-action-default">컬럼 </span>
          <span class="history-action-strong">${after_state.column_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">생성</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 2:
      actionContent = `
          <span class="history-action-default">컬럼 </span>
          <span class="history-action-strong">${before_state.column_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">삭제</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 3:
      actionContent = `
          <span class="history-action-default">컬럼 </span>
          <span class="history-action-strong">${before_state.column_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">${after_state.column_title}</span>
          <span class="history-action-default">로 </span>
          <span class="history-action-strong">변경</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 4:
      actionContent = `
          <span class="history-action-default">테스크 </span>
          <span class="history-action-strong">${after_state.task_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-default">컬럼 </span>
          <span class="history-action-strong">${after_state.column_title}</span>
          <span class="history-action-default">에 </span>
          <span class="history-action-strong">등록</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 5:
      actionContent = `
          <span class="history-action-default">테스크 </span>
          <span class="history-action-strong">${before_state.task_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">삭제</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 6:
      actionContent = `
          <span class="history-action-default">테스크 </span>
          <span class="history-action-strong">${after_state.task_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">변경</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    case 7:
      actionContent = `
          <span class="history-action-default">테스크 </span>
          <span class="history-action-strong">${before_state.task_title}</span>
          <span class="history-action-default">을(를) </span>
          <span class="history-action-strong">${before_state.column_title}</span>
          <span class="history-action-default">에서 </span>
          <span class="history-action-strong">${after_state.column_title}</span>
          <span class="history-action-default">으로 </span>
          <span class="history-action-strong">이동</span>
          <span class="history-action-default">하였습니다.</span>
        `;
      break;
    default:
      actionContent =
        '<span class="history-action-unknown">Unknown Action</span>';
  }

  return `
      <div class="history-content-box">
        <div class="history-left">
          <img class="history-user-profile" src="/img/동글이.jpeg" alt="User Profile"/>
        </div>
        <div class="history-right">
          <span class="history-user-name">${userName}</span>
          <span class="history-action">
            ${actionContent}
          </span>
          <span class="history-time">${formatDate(created_at)}</span>
        </div>
      </div>
    `;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 60000); // difference in minutes

  if (diff < 1) return "방금 전";
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
};
