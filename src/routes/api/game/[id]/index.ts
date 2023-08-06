import { answers } from "@/lib/words";
import { fromId, decode } from '..';
import seedrandom from 'seedrandom';

export const getAnswers = (id: string) => {
  const settings = fromId(id)
  const plain = decode(id)
  const generator = seedrandom(plain)
  
  return [...Array(settings.boards).keys()].map(() => answers[Math.floor(generator() * answers.length)])
}
