import { words } from './../words';
import { fromId, getPlain } from '..';
import seedrandom from 'seedrandom';

export const getAnswers = (id: string) => {
  const settings = fromId(id)
  const plain = getPlain(id)
  const generator = seedrandom(plain)

  return [...Array(settings.boards).keys()].map(() => words[Math.floor(generator() * words.length)])
}
