export type Settings = {boards: number, guesses: number, sequential: number}

const szudzik = (a: number, b:number) => {
  return a >= b ? (a * a + a + b) : (a + b * b)
}

function invSzudzik(z: number) {
  const sqrtz = Math.floor(Math.sqrt(z)), sqz = sqrtz * sqrtz;
  return ((z - sqz) >= sqrtz) ? [sqrtz, z - sqz - sqrtz] : [z - sqz, sqrtz];
}

export const validateSettings = ({boards, guesses, sequential}: Settings) => {
  return boards > 0 && guesses > 0 && sequential != undefined
}

export const toId = ({boards, guesses, sequential}: Settings) => {
  return (szudzik(boards, guesses) << 1) + (sequential ? 1 : 0)
}

export const fromId = (id: number) => {
  const sequential = id % 2 == 1 ? true : false; 
  const [boards, guesses] = invSzudzik(id >> 1)

  return {
    boards, guesses, sequential
  }
}