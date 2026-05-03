'use client'
import { useState } from 'react'

const data = {
  monatsübersicht: [
    { monat: 'Jan', volumen: 490539, cashIn: 296107, nettoCashIn: 255347, deals: 445, cashInRate: 62.93 },
    { monat: 'Feb', volumen: 447249, cashIn: 219238, nettoCashIn: 198919, deals: 283, cashInRate: 55.92 },
    { monat: 'Mär', volumen: 419925, cashIn: 282904, nettoCashIn: 264272, deals: 334, cashInRate: 65.15 },
    { monat: 'Apr', volumen: 407381, cashIn: 304144, nettoCashIn: 251720, deals: 309, cashInRate: 72.53 },
    { monat: 'Mai', volumen: 500, cashIn: 500, nettoCashIn: 500, deals: 1, cashInRate: 100 },
  ],
  partner: [
    { name: 'Candidate-flow', volumen: 335241, cashIn: 195088, netto: 160626 },
    { name: 'Grundl Leadership', volumen: 182072, cashIn: 145843, netto: 121804 },
    { name: 'Schippke', volumen: 165375, cashIn: 126050, netto: 104046 },
    { name: 'ZELLGUT GmbH', volumen: 225016, cashIn: 138487, netto: 111413 },
    { name: 'ECOM HOUSE GmbH', volumen: 111416, cashIn: 47669, netto: 47669 },
    { name: '2b AHEAD ThinkTank', volumen: 72425, cashIn: 51163, netto: 51163 },
    { name: 'Temmer', volumen: 72394, cashIn: 25707, netto: 25707 },
    { name: 'Everflow Excellence', volumen: 68540, cashIn: 22140, netto: 22140 },
    { name: 'Volume-Trader', volumen: 49863, cashIn: 32955, netto: 32955 },
    { name: 'Investmentpunk', volumen: 38828, cashIn: 21608, netto: 21608 },
    { name: 'Schippke (Intern)', volumen: 84500, cashIn: 51750, netto: 42938 },
    { name: 'Eitel Invest AG', volumen: 57500, cashIn: 28317, netto: 25490 },
  ],
  q1: { volumen: 1370984, cashIn: 807875, nettoCashIn: 718539, werktage: 64 },
  april: { volumen: 407381, cashIn: 304144, nettoCashIn: 251720, werktage: 22, prognose: 4709390 },
  ziel: 500000,
}

const fmt = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const fmtK = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(2).replace('.', ',') + ' Mio'
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return String(Math.round(n))
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'übersicht' | 'partner' | 'prognose'>('übersicht')

  const totalVolumen = data.monatsübersicht.reduce((s, m) => s + m.volumen, 0)
  const totalCashIn = data.monatsübersicht.reduce((s, m) => s + m.cashIn, 0)
  const totalDeals = data.monatsübersicht.reduce((s, m) => s + m.deals, 0)
  const avgCashInRate = data.monatsübersicht.reduce((s, m) => s + m.cashInRate, 0) / data.monatsübersicht.length

  const maxVolumen = Math.max(...data.monatsübersicht.map(m => m.volumen))
  const maxPartnerVol = Math.max(...data.partner.map(p => p.volumen))

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e8e4dc', fontFamily: '"DM Sans", system-ui, sans-serif', padding: '0' }}>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: '200px', background: '#151515', borderRight: '1px solid #252525', padding: '28px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ padding: '0 24px 28px', borderBottom: '1px solid #1e1e1e' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>HH SCG</div>
            <div style={{ fontSize: '13px', color: '#888', fontWeight: 300 }}>Sales Dashboard</div>
          </div>
          <nav style={{ padding: '20px 0' }}>
            {(['übersicht', 'partner', 'prognose'] as const).map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '10px 24px',
                  background: activeTab === tab ? '#1e1e1e' : 'transparent',
                  borderLeft: activeTab === tab ? '2px solid #c8a96e' : '2px solid transparent',
                  border: 'none', borderLeftWidth: '2px', borderLeftStyle: 'solid',
                  borderLeftColor: activeTab === tab ? '#c8a96e' : 'transparent',
                  color: activeTab === tab ? '#e8e4dc' : '#555',
                  cursor: 'pointer', textAlign: 'left', fontSize: '13px',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                <span style={{ width: '18px', fontSize: '11px', color: '#444', fontFamily: '"DM Mono", monospace' }}>0{i + 1}</span>
                <span style={{ textTransform: 'capitalize' }}>{tab}</span>
              </button>
            ))}
          </nav>
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
            <div style={{ fontSize: '11px', color: '#444', fontFamily: '"DM Mono", monospace' }}>2026 · Jan–Mai</div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#e8e4dc', margin: 0 }}>
              {activeTab === 'übersicht' ? 'Monatsübersicht' : activeTab === 'partner' ? 'Partner-Auswertung' : 'Prognose & Ziele'}
            </h1>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Umsatztabelle HH SCG 2026</div>
          </div>

          {/* KPI Cards */}
          {activeTab === 'übersicht' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
                {[
                  { label: 'Auftragsvolumen YTD', value: fmtK(totalVolumen) + ' €', sub: 'Jan–Mai 2026' },
                  { label: 'Cash IN YTD', value: fmtK(totalCashIn) + ' €', sub: 'Erste Raten' },
                  { label: 'Deals abgeschlossen', value: totalDeals.toLocaleString('de-DE'), sub: 'Alle Partner' },
                  { label: 'Ø Cash-In Rate', value: avgCashInRate.toFixed(1) + '%', sub: 'Jan–Mai Durchschnitt' },
                ].map(card => (
                  <div key={card.label} style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#555', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{card.label}</div>
                    <div style={{ fontSize: '26px', fontWeight: 500, color: '#e8e4dc', letterSpacing: '-0.02em' }}>{card.value}</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Monthly Chart */}
              <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px 24px 20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>Auftragsvolumen & Cash IN pro Monat</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '160px', marginBottom: '12px' }}>
                  {data.monatsübersicht.map(m => (
                    <div key={m.monat} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '10px', color: '#444', fontFamily: '"DM Mono", monospace', marginBottom: '4px' }}>{fmtK(m.volumen)}</div>
                      <div style={{ width: '100%', display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, background: '#c8a96e', borderRadius: '2px 2px 0 0', height: `${Math.round(m.volumen / maxVolumen * 140)}px`, opacity: m.monat === 'Mai' ? 0.3 : 1 }} />
                        <div style={{ flex: 1, background: '#4a8c6a', borderRadius: '2px 2px 0 0', height: `${Math.round(m.cashIn / maxVolumen * 140)}px`, opacity: m.monat === 'Mai' ? 0.3 : 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {data.monatsübersicht.map(m => (
                    <div key={m.monat} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#555', borderTop: '1px solid #1e1e1e', paddingTop: '8px' }}>{m.monat}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                    <span style={{ width: '10px', height: '10px', background: '#c8a96e', borderRadius: '2px', display: 'inline-block' }} /> Auftragsvolumen
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                    <span style={{ width: '10px', height: '10px', background: '#4a8c6a', borderRadius: '2px', display: 'inline-block' }} /> Cash IN
                  </span>
                </div>
              </div>

              {/* Monthly Table */}
              <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                      {['Monat', 'Auftragsvolumen', 'Cash IN', 'Netto Cash IN', 'Deals', 'Cash-In Rate'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Monat' ? 'left' : 'right', fontSize: '11px', color: '#444', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.monatsübersicht.map((m, i) => (
                      <tr key={m.monat} style={{ borderBottom: i < data.monatsübersicht.length - 1 ? '1px solid #1a1a1a' : 'none', opacity: m.monat === 'Mai' ? 0.5 : 1 }}>
                        <td style={{ padding: '12px 16px', color: '#e8e4dc', fontWeight: 500 }}>{m.monat}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#c8a96e', fontFamily: '"DM Mono", monospace' }}>{fmt(m.volumen)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: '"DM Mono", monospace', color: '#aaa' }}>{fmt(m.cashIn)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: '"DM Mono", monospace', color: '#4a8c6a' }}>{fmt(m.nettoCashIn)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: '"DM Mono", monospace', color: '#666' }}>{m.deals}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: '"DM Mono", monospace', color: m.cashInRate >= 70 ? '#4a8c6a' : m.cashInRate >= 60 ? '#c8a96e' : '#888' }}>{m.cashInRate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Partner Tab */}
          {activeTab === 'partner' && (
            <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '12px', color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>SCG Volumen nach Partner · kumuliert 2026</div>
              </div>
              {data.partner.sort((a, b) => b.volumen - a.volumen).map((p, i) => (
                <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 200px 130px 130px', gap: '16px', alignItems: 'center', padding: '14px 24px', borderBottom: i < data.partner.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div style={{ fontSize: '11px', color: '#333', fontFamily: '"DM Mono", monospace' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#e8e4dc' }}>{p.name}</div>
                    <div style={{ marginTop: '6px', height: '3px', background: '#1a1a1a', borderRadius: '2px' }}>
                      <div style={{ height: '3px', width: `${Math.round(p.volumen / maxPartnerVol * 100)}%`, background: '#c8a96e', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#c8a96e', fontFamily: '"DM Mono", monospace' }}>{fmt(p.volumen)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#4a8c6a', fontFamily: '"DM Mono", monospace' }}>{fmt(p.cashIn)}</div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#555', fontFamily: '"DM Mono", monospace' }}>{fmt(p.netto)}</div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 200px 130px 130px', gap: '16px', padding: '10px 24px', borderTop: '1px solid #252525', background: '#0f0f0f' }}>
                <div />
                <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legende</div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SCG Volumen</div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cash IN</div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Netto</div>
              </div>
            </div>
          )}

          {/* Prognose Tab */}
          {activeTab === 'prognose' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Q1 Gesamt</div>
                  <div style={{ fontSize: '28px', fontWeight: 500, color: '#c8a96e' }}>{fmt(data.q1.volumen)}</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>Auftragsvolumen · {data.q1.werktage} Werktage</div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                    <div style={{ fontSize: '20px', fontWeight: 500, color: '#4a8c6a' }}>{fmt(data.q1.nettoCashIn)}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>Netto Cash IN Q1</div>
                  </div>
                </div>
                <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Jahresprognose (Basis April)</div>
                  <div style={{ fontSize: '28px', fontWeight: 500, color: '#c8a96e' }}>{fmt(data.april.prognose)}</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>Hochrechnung auf 12 Monate</div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                    <div style={{ fontSize: '20px', fontWeight: 500, color: '#aaa' }}>{fmt(data.april.volumen)}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>April Auftragsvolumen</div>
                  </div>
                </div>
              </div>

              {/* Ziel-Fortschritt */}
              <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
                  Monatsziel: {fmt(data.ziel)} Netto Cash IN
                </div>
                {data.monatsübersicht.map(m => {
                  const pct = Math.min(100, Math.round(m.nettoCashIn / data.ziel * 100))
                  const color = pct >= 70 ? '#4a8c6a' : pct >= 50 ? '#c8a96e' : '#7a4a3a'
                  return (
                    <div key={m.monat} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#e8e4dc' }}>{m.monat}</span>
                        <span style={{ fontSize: '12px', fontFamily: '"DM Mono", monospace', color }}>
                          {fmt(m.nettoCashIn)} · <span style={{ fontWeight: 600 }}>{pct}%</span>
                        </span>
                      </div>
                      <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px' }}>
                        <div style={{ height: '4px', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width 0.4s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tages-KPIs April */}
              <div style={{ background: '#151515', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Tagesdurchschnitt April</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'Volumen / Tag', val: fmt(Math.round(data.april.volumen / data.april.werktage)) },
                    { label: 'Cash IN / Tag', val: fmt(Math.round(data.april.cashIn / data.april.werktage)) },
                    { label: 'Netto / Tag', val: fmt(Math.round(data.april.nettoCashIn / data.april.werktage)) },
                  ].map(k => (
                    <div key={k.label}>
                      <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{k.label}</div>
                      <div style={{ fontSize: '18px', fontWeight: 500, color: '#c8a96e', fontFamily: '"DM Mono", monospace' }}>{k.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
