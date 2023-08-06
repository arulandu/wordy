import { browser } from "$app/environment";
import { derived, readable, writable } from "svelte/store";
import type { Settings } from "./api/game";

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
    window.localStorage.setItem('theme', v)
  }
})

export type Player = {
  games: {[key: string] : Game}
}

export type Game = {
  settings: Settings & {id: string},
  guesses: { guess: string; grade: string }[][]
}

export const player = writable<Player>({games: {}}, (set) => {
  if(browser) {
    const prevStr = window.localStorage.getItem('player')
    const val = prevStr ? JSON.parse(prevStr) : {games: {}}
    set(val)
  }
})

player.subscribe((v) => {
  if(browser) {
    window.localStorage.setItem('player', JSON.stringify(v))
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