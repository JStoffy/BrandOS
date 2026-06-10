import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BrandBoxPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch the brand associated with this user
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .single()

  // Fetch recent pages
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">BrandOS</h1>
        <form action="/auth/signout" method="post">
          <button className="text-sm text-slate-500 hover:text-slate-700">Sign out</button>
        </form>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Brand Box */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Your Brand Box</h2>
          <p className="text-slate-500 text-sm mb-6">Everything that makes your brand yours.</p>

          {brand ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Brand Name</p>
                <p className="text-slate-800 font-medium">{brand.name}</p>
              </div>
              {brand.voice_notes && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Voice & Tone</p>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{brand.voice_notes}</p>
                </div>
              )}
              {brand.guidelines && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Guidelines</p>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{brand.guidelines}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500 text-sm">No brand set up yet.</p>
              <p className="text-slate-400 text-xs mt-1">Add your brand in Supabase to get started.</p>
            </div>
          )}
        </section>

        {/* Generate CTA */}
        <section className="bg-blue-600 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Ready to build something?</h3>
            <p className="text-blue-100 text-sm mt-1">Tell BrandOS what you need and it'll generate it on-brand.</p>
          </div>
          <Link
            href="/generate"
            className="bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Generate a page →
          </Link>
        </section>

        {/* Recent pages */}
        {pages && pages.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent pages</h3>
            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-800">{page.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(page.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      page.status === 'live'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {page.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
