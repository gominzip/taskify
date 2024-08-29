export function addClickEvent(target, selector, callback) {
  target.addEventListener("click", (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}

export function addDblClickEvent(target, selector, callback) {
  target.addEventListener("dblclick", (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}

export function addBlurEvent(target, selector, callback) {
  target.addEventListener(
    "blur",
    (e) => {
      if (e.target.matches(selector)) {
        callback(e);
      }
    },
    true
  );
}

export function addKeydownEvent(target, selector, callback) {
  target.addEventListener("keydown", (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}
