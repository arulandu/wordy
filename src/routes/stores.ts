import { readable, writable } from "svelte/store";

export const theme = writable("");

export const time = readable<Date>(new Date(), function start(set) {
	const interval = setInterval(() => {
    set(new Date());
  }, 1000);
 
  return function stop() {
    clearInterval(interval);
  };
});