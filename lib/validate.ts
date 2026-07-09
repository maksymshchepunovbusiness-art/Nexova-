import { z, ZodSchema } from 'zod';

export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<
  | { data: T; error: null; response: null }
  | { data: null; error: z.ZodError; response: Response }
> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      data: null,
      error: new z.ZodError([]),
      response: new Response(
        JSON.stringify({ error: 'Nieprawidłowe dane.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: result.error,
      response: new Response(
        JSON.stringify({
          error: 'Błąd walidacji.',
          details: result.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { data: result.data, error: null, response: null };
}

export const ContactSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
  locale: z.enum(['pl', 'cs', 'en', 'uk']).optional(),
});

export type ContactFormData = z.infer<typeof ContactSchema>;
