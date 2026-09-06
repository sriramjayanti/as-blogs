import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { BarChart3, MousePointerClick, TrendingUp, Filter, Smartphone, Monitor, Globe, Clock } from 'lucide-react';

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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
          Conversion Analytics & UTM Tracker
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Detailed log of in-text contextual clicks, inline product card interactions, and outbound traffic to asbrandoils.com and verified marketplaces.
        </p>
      </div>

      {/* Grouped Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {eventsGrouped.map((g) => (
          <div
            key={g.eventType}
            className="bg-stone-950/70 border border-stone-800 rounded-2xl p-3.5 sm:p-4 space-y-1 shadow-sm"
          >
            <div className="text-[10px] uppercase font-bold text-stone-400 font-mono truncate">
              {g.eventType.replace(/_/g, ' ')}
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">
              {g._count.id}
            </div>
          </div>
        ))}
      </div>

      {/* Events Container */}
      <div className="bg-stone-950/70 border border-stone-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Outbound Event Stream (Latest 50)
          </h3>
          <span className="text-[11px] text-stone-500 font-mono">Real-Time</span>
        </div>

        {/* 1. Mobile Event Cards (visible on < md) */}
        <div className="md:hidden divide-y divide-stone-800/70">
          {events.map((evt) => (
            <div key={evt.id} className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-gold-400 uppercase bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded">
                  {evt.eventType.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-stone-500" />
                  {new Date(evt.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-300 font-medium">
                <span>Slot: <span className="text-white">{evt.placement || 'general'}</span></span>
                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                  {evt.device === 'mobile' ? (
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Monitor className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  {evt.device || 'desktop'}
                </span>
              </div>

              {evt.destinationUrl && (
                <div className="text-[11px] text-stone-500 font-mono truncate flex items-center gap-1 pt-1">
                  <Globe className="w-3 h-3 text-stone-500 shrink-0" />
                  <span className="truncate">{evt.destinationUrl}</span>
                </div>
              )}
            </div>
          ))}

          {events.length === 0 && (
            <div className="py-10 text-center text-stone-500 text-xs px-4">
              No analytics events captured yet. Click on contextual links or product cards to test tracking!
            </div>
          )}
        </div>

        {/* 2. Desktop Data Table (visible on md:) */}
        <div className="hidden md:block overflow-x-auto">
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
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5" />
                      )}
                      {evt.device || 'desktop'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-stone-400 font-mono">
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
