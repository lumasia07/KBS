<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Batch — {{ $order->order_number }}</title>
    <style>
        /* ── Reset ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            background: #f1f5f9;
            color: #1e293b;
        }

        /* ── Screen toolbar ── */
        .toolbar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 24px;
            background: #003366; color: #fff;
        }
        .toolbar h1 { font-size: 16px; font-weight: 600; }
        .toolbar-info { font-size: 13px; opacity: .8; }
        .toolbar-actions { display: flex; gap: 10px; }
        .toolbar-actions button {
            padding: 8px 20px; border: none; border-radius: 6px;
            font-weight: 600; font-size: 13px; cursor: pointer;
        }
        .btn-print { background: #fff; color: #003366; }
        .btn-close { background: rgba(255,255,255,.15); color: #fff; }

        /* ── Page container ── */
        .page-wrap { padding: 70px 20px 20px; }

        /* ── Stamp grid: 5 columns × 8 rows = 40 per page ── */
        .stamp-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 3px;
            max-width: 1100px;
            margin: 0 auto;
        }

        /* ── Individual stamp (small KEBS-style) ── */
        .stamp {
            width: 100%; height: auto; aspect-ratio: 2 / 1;
            border: 1.5px solid #003366;
            border-radius: 3px;
            display: flex;
            overflow: hidden;
            background: linear-gradient(135deg, #f8fafc 0%, #eef4ff 50%, #f8fafc 100%);
            position: relative;
            font-size: 6px;
            page-break-inside: avoid;
        }

        /* Micro-pattern overlay */
        .stamp::before {
            content: '';
            position: absolute; inset: 0;
            background: repeating-linear-gradient(
                45deg,
                transparent, transparent 3px,
                rgba(0,51,102,0.02) 3px, rgba(0,51,102,0.02) 4px
            );
            pointer-events: none;
        }

        /* Left panel: QR + serial */
        .stamp-left {
            width: 28%;
            border-right: 1px dashed rgba(0,51,102,0.3);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 2px 1px;
            background: rgba(255,255,255,0.6);
        }
        .stamp-qr {
            width: 32px; height: 32px;
            background: #0f172a; border-radius: 1px;
            display: flex; align-items: center; justify-content: center;
        }
        .stamp-qr svg { width: 24px; height: 24px; fill: #fff; }
        .stamp-serial {
            margin-top: 1px;
            font-family: 'Courier New', monospace;
            font-weight: 800; font-size: 5px;
            color: #003366;
            letter-spacing: 0.2px;
        }

        /* Right panel: Info */
        .stamp-right {
            flex: 1; padding: 2px 4px;
            display: flex; flex-direction: column;
            justify-content: space-between;
            position: relative;
        }

        .stamp-header {
            text-align: center;
            border-bottom: 1px solid rgba(0,51,102,0.15);
            padding-bottom: 1px;
        }
        .stamp-country {
            font-size: 4px; font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.8px;
        }
        .stamp-bureau {
            font-size: 5.5px; font-weight: 900;
            text-transform: uppercase;
            color: #003366;
            margin-top: 0;
        }

        .stamp-details { margin: 1px 0; }
        .stamp-row {
            display: flex; justify-content: space-between;
            font-size: 5px; line-height: 1.5;
        }
        .stamp-label { color: #64748b; }
        .stamp-value {
            font-weight: 700; color: #1e293b;
            max-width: 60px;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .stamp-footer {
            font-size: 3.5px; text-align: center;
            color: #94a3b8; letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* ── Diamond hologram mark ── */
        .hologram {
            position: absolute; top: 2px; right: 2px;
            width: 10px; height: 10px;
            background: linear-gradient(135deg, #003366, #0052a3, #ffd700, #0052a3, #003366);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            opacity: 0.7;
        }

        /* ── Page break helper ── */
        .page-break { page-break-after: always; break-after: page; }

        /* ── Print styles ── */
        @media print {
            .toolbar { display: none !important; }
            .page-wrap { padding: 0; }

            @page {
                size: A4 landscape;
                margin: 8mm;
            }

            body { background: #fff; }

            .stamp-grid {
                grid-template-columns: repeat(5, 1fr);
                gap: 2px;
                max-width: none;
            }

            .stamp {
                border-width: 1.5px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .hologram {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    {{-- Screen-only toolbar --}}
    <div class="toolbar">
        <div>
            <h1>Batch Print Preview — {{ $order->order_number }}</h1>
            <div class="toolbar-info">
                {{ $stamps->count() }} stamps &bull;
                {{ $order->taxpayer->company_name ?? 'N/A' }} &bull;
                {{ $order->product->name ?? 'N/A' }} &bull;
                {{ $stamps->first()->production_batch ?? '' }}
            </div>
        </div>
        <div class="toolbar-actions">
            <button class="btn-print" onclick="window.print()">&#128424; Print Batch</button>
            <button class="btn-close" onclick="window.close()">&#10005; Close</button>
        </div>
    </div>

    <div class="page-wrap">
        @foreach ($stamps->chunk(40) as $pageIndex => $pageStamps)
            <div class="stamp-grid">
                @foreach ($pageStamps as $stamp)
                    <div class="stamp">
                        <div class="stamp-left">
                            <div class="stamp-qr">
                                {{-- QR code placeholder --}}
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm-1 8h7v7H3v-7zm1 1v5h5v-5H4zM11 3h7v7h-7V3zm1 1v5h5V4h-5zm3 8h1v1h-1v-1zm-4 0h1v3h-1v-3zm2 0h1v1h-1v-1zm0 2h3v1h-3v-1zm0 2h1v3h-1v-3zm2 0h1v1h3v1h-1v1h-1v-1h-1v2h-1v-2h1v-1h-1v-1zm4-2h1v4h-1v-4zm-4 4h1v1h-1v-1zm2 0h1v1h-1v-1z"/>
                                    <rect x="4.5" y="4.5" width="2" height="2"/>
                                    <rect x="4.5" y="12.5" width="2" height="2"/>
                                    <rect x="12.5" y="4.5" width="2" height="2"/>
                                </svg>
                            </div>
                            <div class="stamp-serial">{{ $stamp->serial_number }}</div>
                        </div>
                        <div class="stamp-right">
                            <div class="hologram"></div>
                            <div class="stamp-header">
                                <div class="stamp-country">R&eacute;publique D&eacute;mocratique du Congo</div>
                                <div class="stamp-bureau">Bureau of Standards</div>
                            </div>
                            <div class="stamp-details">
                                <div class="stamp-row">
                                    <span class="stamp-label">Product:</span>
                                    <span class="stamp-value">{{ $order->product->name ?? 'N/A' }}</span>
                                </div>
                                <div class="stamp-row">
                                    <span class="stamp-label">Taxpayer:</span>
                                    <span class="stamp-value">{{ $order->taxpayer->company_name ?? 'N/A' }}</span>
                                </div>
                                <div class="stamp-row">
                                    <span class="stamp-label">Type:</span>
                                    <span class="stamp-value">{{ $order->stampType->name ?? 'Excisable' }}</span>
                                </div>
                            </div>
                            <div class="stamp-footer">Authenticated &bull; Secure &bull; Traceable</div>
                        </div>
                    </div>
                @endforeach
            </div>
            @if (!$loop->last)
                <div class="page-break"></div>
            @endif
        @endforeach
    </div>
</body>
</html>
