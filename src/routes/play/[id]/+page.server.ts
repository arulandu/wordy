import { validateSettings } from '@/routes/api/game';
import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const id = params.id
  if(!id) throw new Error("must have id")

  const res = await (await fetch(`${API_URL}/game/${encodeURIComponent(id)}`)).json()

  return {
    settings: validateSettings(res) ? {id, ...res} : null
  }
}) satisfies PageServerLoad