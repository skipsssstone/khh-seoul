'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const mono = { fontFamily: "'Space Mono', monospace" }

type Venue = { id: number; name: string; area: string }
type Event = {
  id: number; title: string; date: string; start_time: string
  venue_id: number; price: string; status: string
  source_url: string; notes: string; is_urgent: boolean
  venues?: { name: string; area: string }
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [tab, setTab] = useState<'add' | 'list'>('add')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    title: '', date: '', start_time: '', venue_id: '',
    price: '', status: 'confirmed', source_url: '', notes: '', is_urgent: false
  })

  const fetchData = async () => {
    const { data: v } = await supabase.from('venues').select('*')
    const { data: e } = await supabase.from('events').select('*, venues(name, area)').order('date', { ascending: true })
    if (v) setVenues(v)
    if (e) setEvents(e)
  }

  useEffect(() => { if (auth) fetchData() }, [auth])

  if (!auth) return (
    <main style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '300px' }}>
        <div style={{ ...mono, fontSize: '12px', letterSpacing: '0.2em', color: '#555', marginBottom: '1rem' }}>ADMIN ACCESS</div>
        <input
          type="password" placeholder="password" value={pw}
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
    setLoading(true); setMsg('')
    const payload = {
      title: form.title, date: form.date, start_time: form.start_time,
      venue_id: parseInt(form.venue_id), price: form.price,
      status: form.status, source_url: form.source_url,
      notes: form.notes, is_urgent: form.is_urgent
    }
    const { error } = editingId
      ? await supabase.from('events').update(payload).eq('id', editingId)
      : await supabase.from('events').insert([payload])
    setLoading(false)
    if (error) { setMsg('error: ' + error.message) }
    else {
      setMsg(editingId ? '✓ updated' : '✓ event added')
      setForm({ title: '', date: '', start_time: '', venue_id: '', price: '', status: 'confirmed', source_url: '', notes: '', is_urgent: false })
      setEditingId(null)
      fetchData()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    setMsg('✓ deleted')
    fetchData()
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setForm({
      title: event.title, date: event.date,
      start_time: event.start_time?.slice(0, 5) || '',
      venue_id: String(event.venue_id), price: event.price || '',
      status: event.status, source_url: event.source_url || '',
      notes: event.notes || '', is_urgent: event.is_urgent
    })
    setTab('add')
    window.scrollTo(0, 0)
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#555', marginBottom: '4px' }}>{label}</div>
      <input type={type} placeholder={placeholder}
        value={form[key as keyof typeof form] as string}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ ...mono, width: '100%', background: 'transparent', border: '0.5px solid #333', color: '#fff', padding: '8px 10px', fontSize: '13px', outline: 'none' }}
      />
    </div>
  )

  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff', padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#B4A7FF', marginBottom: '0.5rem' }}>▶ ADMIN</div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '0.5px solid #222' }}>
        {(['add', 'list'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.1em', padding: '8px 16px', background: 'transparent', border: 'none', color: tab === t ? '#fff' : '#444', borderBottom: tab === t ? '1px solid #fff' : 'none', cursor: 'pointer' }}>
            {t === 'add' ? (editingId ? 'EDIT EVENT' : 'ADD EVENT') : `ALL EVENTS (${events.length})`}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <>
          {editingId && (
            <div style={{ ...mono, fontSize: '11px', color: '#B4A7FF', marginBottom: '1rem', padding: '8px', border: '0.5px solid #B4A7FF' }}>
              Editing event #{editingId} —
              <span onClick={() => { setEditingId(null); setForm({ title: '', date: '', start_time: '', venue_id: '', price: '', status: 'confirmed', source_url: '', notes: '', is_urgent: false }) }}
                style={{ cursor: 'pointer', marginLeft: '8px', color: '#555' }}>cancel ×</span>
            </div>
          )}

          {field('TITLE', 'title', 'text', 'e.g. Late Night Cypher @ Modeci')}
          {field('DATE', 'date', 'date')}
          {field('START TIME', 'start_time', 'time')}

          {/* VENUE 下拉选择 */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#555', marginBottom: '4px' }}>VENUE</div>
            <select value={form.venue_id} onChange={e => setForm({ ...form, venue_id: e.target.value })}
              style={{ ...mono, width: '100%', background: '#000', border: '0.5px solid #333', color: form.venue_id ? '#fff' : '#555', padding: '8px 10px', fontSize: '13px', outline: 'none' }}>
              <option value="">Select venue...</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} · {v.area}</option>
              ))}
            </select>
          </div>

          {field('PRICE', 'price', 'text', 'e.g. ₩20,000 or Free')}

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#555', marginBottom: '4px' }}>STATUS</div>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ ...mono, width: '100%', background: '#000', border: '0.5px solid #333', color: '#fff', padding: '8px 10px', fontSize: '13px', outline: 'none' }}>
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

          <button onClick={handleSubmit} disabled={loading}
            style={{ ...mono, width: '100%', background: loading ? '#111' : '#fff', color: '#000', border: 'none', padding: '12px', fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer' }}>
            {loading ? 'SAVING...' : editingId ? 'UPDATE EVENT' : 'ADD EVENT'}
          </button>
          {msg && <p style={{ ...mono, fontSize: '11px', color: msg.startsWith('✓') ? '#B4A7FF' : '#ff4444', marginTop: '1rem' }}>{msg}</p>}
        </>
      )}

      {tab === 'list' && (
        <div>
          {events.map(event => (
            <div key={event.id} style={{ borderBottom: '0.5px solid #1a1a1a', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>{event.title}</div>
                <div style={{ ...mono, fontSize: '11px', color: '#555' }}>
                  {event.date} · {event.start_time?.slice(0, 5)} · {event.venues?.name}
                </div>
                <div style={{ ...mono, fontSize: '10px', color: '#333', marginTop: '2px' }}>{event.price} · {event.status}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
                <button onClick={() => handleEdit(event)}
                  style={{ ...mono, fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '0.5px solid #333', color: '#555', cursor: 'pointer' }}>EDIT</button>
                <button onClick={() => handleDelete(event.id)}
                  style={{ ...mono, fontSize: '10px', padding: '4px 8px', background: 'transparent', border: '0.5px solid #333', color: '#ff4444', cursor: 'pointer' }}>DEL</button>
              </div>
            </div>
          ))}
          {msg && <p style={{ ...mono, fontSize: '11px', color: msg.startsWith('✓') ? '#B4A7FF' : '#ff4444', marginTop: '1rem' }}>{msg}</p>}
        </div>
      )}
    </main>
  )
}