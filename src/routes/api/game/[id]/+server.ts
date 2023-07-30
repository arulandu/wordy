import { fromId } from "@/routes/api/game";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { getAnswer } from ".";
import { words } from "../words";

export const GET = (async ({ params }) => {
  const {id} = params

  return json(fromId(parseInt(id)))
}) satisfies RequestHandler;

export const PUT = (async ({request, params}) => {
  const {id} = params
  const body = await request.json();
  const guess = body.guess;
  if(words.indexOf(guess) == -1) return json({valid: false})

  const answer = [...getAnswer(parseInt(id))]
  const grade = [...guess].map((c:string, i:number) => {
    if(answer[i] === c) return "🟩"
    const j = answer.indexOf(c)
    if(j == -1) return "⬜"
    answer[j] = "_"
    return "🟨"
  })
  
  return json({valid: true, grade: grade.join()})
}) satisfies RequestHandler