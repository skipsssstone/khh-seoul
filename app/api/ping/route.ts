import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { error } = await supabase
      .from('events')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase ping failed:', error.message)

      return NextResponse.json(
        { ok: false, error: 'Database query failed' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      ok: true,
      time: new Date().toISOString()
    })
  } catch (error) {
    console.error('Supabase ping exception:', error)

    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 }
    )
  }
}
