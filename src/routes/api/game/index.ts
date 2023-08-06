import { getDay } from "@/lib";

export type Settings = { boards: number, guesses: number, sequential: boolean, seed?: number, day: number }

export const validateSettings = (settings: Settings) => {
  return settings.boards > 0 && settings.guesses > 0 && settings.sequential != undefined && settings.day <= getDay()
}

const SEP = "_"
const ALPHA_SEP = "z"
export const toId = (settings: Settings) => {
  const plain = [settings.boards, settings.guesses, settings.sequential ? 1 : 0, settings.seed, settings.day].join(SEP)
  const id = encode(plain)

  return id
}

export const encode = (plain: string) => {
  return plain.split("").map(c => {
    if (c.charCodeAt(0) >= "0".charCodeAt(0) && c.charCodeAt(0) <= "9".charCodeAt(0)) {
      return String.fromCharCode(c.charCodeAt(0) - "0".charCodeAt(0) + "a".charCodeAt(0))
    } else if (c == SEP) {
      return "z"
    }

    throw Error("Can't encode this.")
  }).join("")
}
export const decode = (id: string) => {
  return id.split("").map(c => {
    if (c.charCodeAt(0) >= "a".charCodeAt(0) && c.charCodeAt(0) <= "j".charCodeAt(0)) {
      return String.fromCharCode(c.charCodeAt(0) - "a".charCodeAt(0) + "0".charCodeAt(0))
    } else if (c == ALPHA_SEP) {
      return SEP
    }

    throw Error("Can't decode this")
  }).join("")
}

export const fromId = (id: string): Settings => {
  const plain = decode(id)
  const [boards, guesses, sequential, seed, day] = plain.split(SEP)

  return {
    boards: parseInt(boards),
    guesses: parseInt(guesses),
    sequential: sequential === "1",
    day: parseInt(day),
    seed: parseInt(seed) == 0 ? undefined : parseInt(seed)
  }
}