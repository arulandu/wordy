import { MersenneTwister } from '@/lib/random';
import { words } from './../words';
import { fromId } from '..';

export const getAnswers = (id: number) => {
  const settings = fromId(id)
  const generator = new MersenneTwister(id)

  return [...Array(settings.boards).keys()].map(() => words[Math.floor(generator.random() * words.length)])
}
