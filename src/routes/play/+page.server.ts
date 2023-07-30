import { validateSettings } from '@/routes/api/game';
import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  const id = url.searchParams.get("id")
  const res = await (await fetch(`${API_URL}/game/${id}`)).json()
  
  return {
    settings: validateSettings(res) ? {id, ...res} : null
  }
}) satisfies PageServerLoad