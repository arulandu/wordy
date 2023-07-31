import { writable } from "svelte/store";
import type { Settings } from "../api/game";

export const settings = writable<(Settings&{id:number})>()