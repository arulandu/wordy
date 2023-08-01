import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toId, validateSettings } from "@/routes/api/game";

const MAX_RANDOM_PER_DAY = 1000;

export const POST = (async ({ request }) => {
  const settings = await request.json()
  settings.seed = settings.daily ? 0 : (1+Math.floor(Math.random()*MAX_RANDOM_PER_DAY));
  const id = validateSettings(settings) ? toId(settings) : null;

  return json({id})
}) satisfies RequestHandler;