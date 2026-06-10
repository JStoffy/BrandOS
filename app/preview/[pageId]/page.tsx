import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Props {
  params: { pageId: string }
}

export default async function PreviewPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.pageId)
    .single()

  if (!page) notFound()

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Preview toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/generate" className="text-slate-400 hover:text-slate-200 text-sm">
            ← Back
          </Link>
          <span className="text-white font-medium text-sm">{page.title}</span>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            {page.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {page.status === 'draft' && (
            <form action={`/api/deploy`} method="POST">
              <input type="hidden" name="pageId" value={page.id} />
              <Link
                href={`/deploy/${page.id}`}
                className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Deploy →
              </Link>
            </form>
          )}
          {page.status === 'live' && (
            <span className="text-green-400 text-sm font-medium">✓ Live</span>
          )}
        </div>
      </div>

      {/* iframe preview */}
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={page.generated_content}
          className="w-full h-full border-0"
          title={page.title}
          sandbox="allow-scripts"
          style={{ minHeight: 'calc(100vh - 57px)' }}
        />
      </div>
    </div>
  )
}
