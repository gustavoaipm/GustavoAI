import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'

const bodySchema = z.object({
  email: z.string().trim().email(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null)
    const parsed = bodySchema.safeParse(json)

    if (!parsed.success) {
      return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    const { error } = await supabase.from('email_signups').insert({ email })

    // Duplicate email (unique constraint) should still be treated as success
    if (error) {
      const message = (error as any)?.message?.toLowerCase?.() || ''
      const code = (error as any)?.code

      if (code === '23505' || message.includes('duplicate')) {
        return Response.json({ message: "You're already on the list — we'll be in touch!" }, { status: 200 })
      }

      return Response.json({ error: 'Unable to save your email right now. Please try again.' }, { status: 500 })
    }

    return Response.json({ message: "Thanks — you're on the list!" }, { status: 200 })
  } catch {
    return Response.json({ error: 'Unexpected error. Please try again.' }, { status: 500 })
  }
}


