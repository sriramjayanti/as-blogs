import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { BarChart3, MousePointerClick, TrendingUp, Filter, Smartphone, Monitor } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const [events, eventsGrouped] = await Promise.all([
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: { id: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Conversion Analytics & UTM Tracker
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Detailed log of in-text contextual clicks, inline product card interactions, and outbound traffic to asbrandoils.com and verified marketplaces.
        </p>
      </div>

      {/* Grouped Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {eventsGrouped.map((g) => (
          <div
            key={g.eventType}
            className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-1"
          >
            <div className="text-[10px] uppercase font-bold text-stone-400 font-mono">
              {g.eventType.replace(/_/g, ' ')}
            </div>
            <div className="text-2xl font-serif font-bold text-white">
              {g._count.id}
            </div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-stone-950/70 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Outbound Event Stream (Latest 50)
          </h3>
          <span className="text-xs text-stone-500 font-mono">Real-Time Ingestion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900/80 text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-6">Placement Slot</th>
                <th className="py-3.5 px-6">UTM Campaign</th>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-6">Device</th>
                <th className="py-3.5 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-stone-900/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-semibold text-gold-400">
                    {evt.eventType}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-stone-200">
                    {evt.placement || 'general'}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-stone-400">
                    {evt.utmCampaign || 'organic'}
                  </td>
                  <td className="py-3.5 px-6 truncate max-w-xs text-stone-400 font-mono text-[10px]">
                    {evt.destinationUrl || 'asbrandoils.com'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="flex items-center gap-1 text-stone-400">
                      {evt.device === 'mobile' ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5" />
                      )}
                      {evt.device || 'desktop'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-stone-400">
                    {new Date(evt.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No analytics events captured yet. Click on contextual links or product cards to test tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
