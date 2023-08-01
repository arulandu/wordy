import { fromId } from "@/routes/api/game";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { getAnswers } from ".";
import { words } from "../words";

export const GET = (async ({ params }) => {
  const {id} = params
  const settings = fromId(id)

  return json(settings)
}) satisfies RequestHandler;

export const PUT = (async ({request, params}) => {
  const {id} = params
  const body = await request.json();
  const guess = body.guess.toLowerCase();
  if(words.indexOf(guess) == -1) return json({valid: false})

  const answers = getAnswers(id).map(a => [...a])

  const grades = answers.map(answer => [...guess].map((c:string, i:number) => {
    if(answer[i] === c) return "G"
    const j = answer.indexOf(c)
    if(j == -1) return "B"
    answer[j] = "_"
    return "Y"
  }).join(""))
  
  return json({valid: true, grades})
}) satisfies RequestHandler