import './bodyScroll.css';

let scrollY = 0;
export function disableBodyScroll() {
  scrollY = window.scrollY;
  document.body.classList.add('no-scroll');
}

export function enableBodyScroll() {
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, scrollY);
}

export function disablePullToRefresh() {
  document.body.classList.add('no-pull-to-refresh');
}

export function enablePullToRefresh() {
  document.body.classList.remove('no-pull-to-refresh');
}
