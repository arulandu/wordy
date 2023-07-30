import { MersenneTwister } from '@/lib/random';
import { words } from './../words';

export const getAnswer = (id: number) => {
  const generator = new MersenneTwister(id)
  const ind = Math.floor(generator.random() * words.length)
  return words[ind]
}
