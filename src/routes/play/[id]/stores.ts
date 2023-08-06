import { derived, writable, type Updater } from "svelte/store";
import type { Settings } from "@/routes/api/game";
import { player, type Game, type Player } from "@/routes/stores";
import { page } from "$app/stores";

const clonedWithPrototype = <T extends object>(source: T): T => {
	const clone = Object.create(source);
	Object.assign(clone, source);
	return clone;
};

const createGame = () => {
  const store = derived([player, page], ([$player, $page], set: (value: Game) => void, update) => {
    let val = $player.games[$page.data.settings.id]
    if(!val) {
      val = {settings: $page.data.settings, guesses: [...Array($page.data.settings.boards).keys()].map(() => [])}
    }
    set(val)
  })

  return {
    subscribe: store.subscribe,
    set: (val: Game) => {
      player.update(($player) => {
       const newPlayer = clonedWithPrototype($player)
        newPlayer.games[val.settings.id] = val

        return newPlayer as Player;
      })
    },
  }
}

export const game = createGame()
