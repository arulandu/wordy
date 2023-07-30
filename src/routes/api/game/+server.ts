import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toId, validateSettings } from "@/routes/api/game";

export const POST = (async ({ request }) => {
  const settings = await request.json()

  const id = validateSettings(settings) ? toId(settings) : null;

  return json({id})
}) satisfies RequestHandler;