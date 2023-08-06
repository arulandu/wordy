import { browser } from "$app/environment";
import { derived, readable, writable } from "svelte/store";
import type { Settings } from "./api/game";

export enum Mode {
  LIGHT = 'light',
  DARK = 'dark'
}

type Theme = {
  mode: Mode,
  hue: number
}
// TODO: switch to server side
export const theme = writable<Theme>({mode: Mode.LIGHT, hue: 264}, (set) => {
  if(browser) {
    let val;
    try {
      const prev = window.localStorage.getItem('theme');
      if(!prev) throw Error("No stored theme")

      val = JSON.parse(prev)
    } catch(e) {
      console.error(e)
      val = {mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? Mode.DARK : Mode.LIGHT, hue: 264}
    }

    set(val)
  }
});

theme.subscribe((v) => {
  if(browser) {
    window.localStorage.setItem('theme', JSON.stringify(v))
  }
})

interface Player {
  games: {[key: string] : Game}
}

export type Game = {
  settings: Settings & {id: string},
  guesses: { guess: string; grade: string }[][]
}

export const player = writable<Player>({games: {}}, (set) => {
  if(browser) {
    let val;
    try {
      const prev = window.localStorage.getItem('player');
      if(!prev) throw Error("No stored player")

      val = JSON.parse(prev)
    } catch(e) {
      console.error(e)
      val = {games: {}}
    }

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