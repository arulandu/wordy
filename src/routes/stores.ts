import { browser } from "$app/environment";
import { readable, writable } from "svelte/store";

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

// TODO: switch to server side
export const theme = writable(Theme.LIGHT, (set) => {
  if(browser) {
    const prev = window.localStorage.getItem('theme') as Theme | null
    const val = prev ? prev : window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT
    set(val)
  }
});

theme.subscribe((v) => {
  if(browser) {
    console.log('sub', v)
    window.localStorage.setItem('theme', v)
  }
})

export const time = readable<Date>(new Date(), function start(set) {
	const interval = setInterval(() => {
    set(new Date());
  }, 1000);
 
  return function stop() {
    clearInterval(interval);
  };
});