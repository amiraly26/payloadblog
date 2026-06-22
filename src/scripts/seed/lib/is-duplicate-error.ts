import { z } from 'zod'

const payloadErrorSchema = z.object({
  name: z.string(),
  status: z.number(),
  data: z.object({
    collection: z.string(),
    errors: z.array(
      z.object({
        message: z.string(),
        path: z.string(),
      }),
    ),
  }),
})

type PayloadErrorLike = z.infer<typeof payloadErrorSchema>

export function isPayloadError(error: unknown): error is PayloadErrorLike {
  return payloadErrorSchema.safeParse(error).success
}

export function isDuplicateError(error: unknown, field: string): boolean {
  return (
    isPayloadError(error) &&
    error.data.errors.some(
      (entry) => entry.path === field && /already registered/i.test(entry.message),
    )
  )
}
