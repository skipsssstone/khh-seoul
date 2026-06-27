'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const mono = { fontFamily: "'Space Mono', monospace" }

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', date: '', start_time: '', venue_id: '',
    price: '', status: 'confirmed', source_url: '', notes: '', is_urgent: false
  })

  if (!auth) return (
    <main style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '300px' }}>
        <div style={{ ...mono, fontSize: '12px', letterSpacing: '0.2em', color: '#555', marginBottom: '1rem' }}>ADMIN ACCESS</div>
        <input
          type="password"
          placeholder="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? setAuth(true) : setMsg('wrong password'))}
          style={{ ...mono, width: '100%', background: 'transparent', border: '0.5px solid #333', color: '#fff', padding: '10px', fontSize: '13px', outline: 'none', marginBottom: '8px' }}
        />
        <button
          onClick={() => pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? setAuth(true) : setMsg('wrong password')}
          style={{ ...mono, width: '100%', background: '#fff', color: '#000', border: 'none', padding: '10px', fontSize: '12px', letterSpacing: '0.1em', cursor: 'pointer' }}
        >ENTER</button>
        {msg && <p style={{ ...mono, fontSize: '11px', color: '#ff4444', marginTop: '8px' }}>{msg}</p>}
      </div>
    </main>
  )

  const handleSubmit = async () => {
    setLoading(true)
    setMsg('')
    const { error } = await supabase.from('events').insert([{
      title: form.title,
      date: form.date,
      start_time: form.start_time,
      venue_id: parseInt(form.venue_id),
      price: form.price,
      status: form.status,
      source_url: form.source_url,
      notes: form.notes,
      is_urgent: form.is_urgent
    }])
    setLoading(false)
    if (error) { setMsg('error: ' + error.message) }
    else {
      setMsg('✓ event added')
      setForm({ title: '', date: '', start_time: '', venue_id: '', price: '', status: 'confirmed', source_url: '', notes: '', is_urgent: false })
    }
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#555', marginBottom: '4px' }}>{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key as keyof typeof form] as string}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ ...mono, width: '100%', background: 'transparent', border: '0.5px solid #333', color: '#fff', padding: '8px 10px', fontSize: '13px', outline: 'none' }}
      />
    </div>
  )

  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff', padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#B4A7FF', marginBottom: '0.5rem' }}>▶ ADMIN</div>
      <h1 style={{ fontSize: '18px', fontWeight: 400, marginBottom: '2rem', borderBottom: '0.5px solid #222', paddingBottom: '1rem' }}>Add New Event</h1>

      {field('TITLE', 'title', 'text', 'e.g. Late Night Cypher @ Modeci')}
      {field('DATE', 'date', 'date')}
      {field('START TIME', 'start_time', 'time')}
      {field('VENUE ID', 'venue_id', 'number', '1')}
      {field('PRICE', 'price', 'text', 'e.g. ₩20,000 or Free')}

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#555', marginBottom: '4px' }}>STATUS</div>
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ ...mono, width: '100%', background: '#000', border: '0.5px solid #333', color: '#fff', padding: '8px 10px', fontSize: '13px', outline: 'none' }}
        >
          <option value="confirmed">CONFIRMED</option>
          <option value="unconfirmed">UNCONFIRMED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      </div>

      {field('SOURCE URL', 'source_url', 'text', 'https://instagram.com/...')}
      {field('NOTES', 'notes', 'text', '추가 정보')}

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" checked={form.is_urgent} onChange={e => setForm({ ...form, is_urgent: e.target.checked })} id="urgent" />
        <label htmlFor="urgent" style={{ ...mono, fontSize: '11px', color: '#555', letterSpacing: '0.1em', cursor: 'pointer' }}>TONIGHT / URGENT</label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ ...mono, width: '100%', background: loading ? '#111' : '#fff', color: '#000', border: 'none', padding: '12px', fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer' }}
      >{loading ? 'SAVING...' : 'ADD EVENT'}</button>

      {msg && <p style={{ ...mono, fontSize: '11px', color: msg.startsWith('✓') ? '#B4A7FF' : '#ff4444', marginTop: '1rem' }}>{msg}</p>}
    </main>
  )
}