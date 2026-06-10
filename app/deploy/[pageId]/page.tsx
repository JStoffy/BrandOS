import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Props {
  params: { pageId: string }
}

export default async function DeployPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.pageId)
    .single()

  if (!page) notFound()

  // Mark as live
  await supabase
    .from('pages')
    .update({ status: 'live' })
    .eq('id', params.pageId)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center px-6">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page deployed!</h1>
        <p className="text-slate-500 mb-2">
          <span className="font-medium text-slate-700">{page.title}</span> is now live.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          In the full build, this will deploy to your live domain. For now, it's marked live in your brand box.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href={`/preview/${params.pageId}`}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-100 transition-colors"
          >
            View page
          </Link>
          <Link
            href="/brand-box"
            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to brand box
          </Link>
        </div>
      </div>
    </div>
  )
}
