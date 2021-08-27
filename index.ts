import './style.css';

import { map, fromEvent, merge } from 'rxjs';
import {
  first,
  mergeAll,
  mergeMap,
  share,
  startWith,
  switchMap,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
const $view = document.getElementById('carousel');
const $container = document.querySelector('.container');
const PANEL_COUNT = $container.querySelectorAll('.panel').length;

const SUPPORT_TOUCH = 'ontouchstart' in window;

const EVENTS = {
  start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
  move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
  end: SUPPORT_TOUCH ? 'touchend' : 'mouseup'
};

const start$ = fromEvent($view, EVENTS.start).pipe(toPos);
const move$ = fromEvent($view, EVENTS.move).pipe(toPos);
const end$ = fromEvent($view, EVENTS.end);

const drag$ = start$.pipe(
  switchMap((start: number) =>
    move$.pipe(
      map((move: number) => move - start),
      takeUntil(end$)
    )
  )
);

const size$ = fromEvent(window, 'resize').pipe(
  startWith(0),
  map(event => $view.clientWidth)
);
size$.subscribe(width => console.log('view의 넓이1', width));

const drop$ = drag$.pipe(
  switchMap(drag =>
    end$.pipe(
      map(event => drag),
      first()
    )
  ),
  withLatestFrom(size$)
);

drop$.subscribe(value => {
  console.log('drop', value);
});

function toPos(obs$) {
  return obs$.pipe(
    map((v: TouchEvent & MouseEvent) =>
      SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX
    )
  );
}

const carousel$ = merge(drag$, drop$);
