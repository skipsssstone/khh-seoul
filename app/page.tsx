import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid #222' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em' }}>
            KHH<span style={{ color: '#B4A7FF' }}>.SEOUL🎤</span>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.3em', color: '#555', marginTop: '2px' }}>공연 정보</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['EN', '한', '中', '日'].map(l => (
            <span key={l} style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: l === 'EN' ? '#fff' : '#444', cursor: 'pointer', letterSpacing: '0.1em' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '2rem 1.5rem 1.5rem', borderBottom: '0.5px solid #222', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Space Mono', monospace", fontSize: '72px', color: '#111', lineHeight: 1, letterSpacing: '-4px', userSelect: 'none' }}>공연<br/>일정</div>
        <h1 style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '6px', position: 'relative' }}>Korean hip-hop<br/>shows in Seoul</h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#555', letterSpacing: '0.05em', position: 'relative' }}>// UNDERGROUND · CLUB · LIVE · 서울</p>
      </div>

      {/* FILTERS */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '6px', flexWrap: 'wrap' as const, borderBottom: '0.5px solid #222' }}>
        {['ALL', 'TONIGHT', 'THIS WEEK', '홍대', '이태원', '강남', 'FREE'].map((f, i) => (
          <span key={f} style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', padding: '4px 10px', border: i === 0 ? '0.5px solid #fff' : '0.5px solid #333', color: i === 0 ? '#fff' : '#555', cursor: 'pointer', letterSpacing: '0.05em' }}>{f}</span>
        ))}
      </div>

      {/* TONIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.5rem 0.5rem', borderBottom: '0.5px solid #222' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: '#555' }}>▶ TONIGHT</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#222' }}>오늘 밤</span>
      </div>

      {events && events.filter(e => {
        const today = new Date().toISOString().slice(0, 10)
        return e.date === today
      }).map(event => (
        <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '0.5px solid #1a1a1a', borderLeft: '2px solid #fff' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>{event.title}</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>⏱ {event.start_time?.slice(0, 5)}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>📍 venue {event.venue_id}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>₩ {event.price}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', padding: '2px 6px', border: '0.5px solid #fff', color: '#fff' }}>TONIGHT</span>
          </div>
        </div>
      ))}

      {/* THIS WEEK */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.5rem 0.5rem', borderBottom: '0.5px solid #222' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: '#555' }}>▶ THIS WEEK</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#222' }}>이번 주</span>
      </div>

      {events && events.map(event => (
        <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '0.5px solid #1a1a1a', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>{event.title}</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>📅 {event.date}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>⏱ {event.start_time?.slice(0, 5)}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>📍 venue {event.venue_id}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', padding: '2px 6px', border: `0.5px solid ${event.status === 'confirmed' ? '#333' : '#2a2a00'}`, color: '#555' }}>{event.status?.toUpperCase()}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#fff' }}>{event.price}</span>
          </div>
        </div>
      ))}

      {/* FOOTER */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', letterSpacing: '0.05em' }}>LAST UPDATE — {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333' }}>정보는 변경될 수 있습니다</span>
      </div>
    </main>
  )
}