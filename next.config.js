/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Suppress Supabase Node.js API warning in Edge Runtime (non-fatal)
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}

module.exports = nextConfig
