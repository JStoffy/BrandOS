import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  const supabase = createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { prompt } = await request.json()
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  // Fetch brand context
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, voice_notes, guidelines')
    .single()

  const brandContext = brand
    ? `Brand: ${brand.name}\nVoice & Tone: ${brand.voice_notes || 'Not specified'}\nGuidelines: ${brand.guidelines || 'Not specified'}`
    : 'No brand context set yet.'

  // Generate with Claude
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are a brand-aware landing page generator. Generate a complete, self-contained HTML landing page based on the request below.

BRAND CONTEXT:
${brandContext}

REQUEST:
${prompt}

Rules:
- Return ONLY valid HTML — no markdown, no explanation, just the HTML document
- Include Tailwind CSS via CDN for styling
- Make it look polished and professional
- Keep the brand voice throughout all copy
- Use a clean, modern design with good typography
- The page should be complete and ready to preview`,
      },
    ],
  })

  const generatedHtml = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract a title from the generated HTML
  const titleMatch = generatedHtml.match(/<title>(.*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1] : `Page — ${new Date().toLocaleDateString()}`

  // Save to Supabase
  const { data: page, error } = await supabase
    .from('pages')
    .insert({
      brand_id: brand?.id ?? null,
      title,
      generated_content: generatedHtml,
      prompt,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 })
  }

  return NextResponse.json({ pageId: page.id })
}
