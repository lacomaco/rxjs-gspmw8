import './style.css';

import { of, map, fromEvent } from 'rxjs';
import { mergeAll, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
const $view = document.getElementById('carousel');
const $container = document.querySelector('.container');
const PANEL_COUNT = $container.querySelectorAll('.panel').length;

const SUPPORT_TOUCH = 'ontouchstart' in window;

const EVENTS = {
  start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
  move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
  end: SUPPORT_TOUCH ? 'touchend' : 'mouseup'
};

const start$ = fromEvent($view, EVENTS.start).pipe(map(toPos));
const move$ = fromEvent($view, EVENTS.move).pipe(map(toPos));
const end$ = fromEvent($view, EVENTS.end);

const drag$ = start$.pipe(switchMap(start => move$.pipe(takeUntil(end$))));

function toPos(obs$) {
  return obs$.pipe(
    map((v: TouchEvent & MouseEvent) =>
      SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX
    )
  );
}
