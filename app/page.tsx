import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">KHH Seoul 🎤</h1>
      <p className="text-gray-400 mb-8">Korean Hip-Hop Events in Seoul</p>

      <div className="space-y-4">
        {events && events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-700 rounded-lg p-6 hover:border-white transition-colors"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <span className={`text-sm px-2 py-1 rounded ${
                  event.status === 'confirmed'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-gray-400">
                <p>📅 {event.date} {event.start_time}</p>
                <p>💰 {event.price}</p>
                {event.notes && <p>📝 {event.notes}</p>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events found.</p>
        )}
      </div>
    </main>
  )
}