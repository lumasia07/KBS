<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Batch — {{ $order->order_number }}</title>
    {{-- QR code generator (lightweight, no dependencies) --}}
    <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
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
        .page-wrap { padding: 70px 10px 10px; }

        /* ── Stamp sheet: 4 columns × 7 rows = 28 per A4 landscape ── */
        .stamp-sheet {
            width: 277mm;  /* A4 landscape minus margins */
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(7, 1fr);
            gap: 0;
            border: 0.5px solid #cbd5e1;
        }

        /* ── Individual stamp sticker ── */
        .stamp {
            width: 100%;
            height: 26mm;
            display: flex;
            align-items: stretch;
            position: relative;
            background: #fff;
            font-size: 6.5px;
            page-break-inside: avoid;
            overflow: hidden;
            /* Cut partition borders */
            border-right: 1px dashed #94a3b8;
            border-bottom: 1px dashed #94a3b8;
        }

        /* Remove right border on last column */
        .stamp:nth-child(4n) { border-right: none; }

        /* Remove bottom border on last row */
        .stamp-sheet .stamp:nth-last-child(-n+4) { border-bottom: none; }

        /* Scissors icon on cut lines (screen only) */
        .stamp::after {
            content: '✂';
            position: absolute;
            bottom: -6px;
            right: -6px;
            font-size: 8px;
            color: #94a3b8;
            z-index: 2;
        }
        .stamp:nth-child(4n)::after { display: none; }
        .stamp-sheet .stamp:nth-last-child(-n+4)::after { display: none; }

        /* ── Subtle guilloche security pattern ── */
        .stamp::before {
            content: '';
            position: absolute; inset: 0;
            background:
                repeating-linear-gradient(
                    0deg,
                    transparent, transparent 2.5mm,
                    rgba(0,51,102,0.015) 2.5mm, rgba(0,51,102,0.015) 2.6mm
                ),
                repeating-linear-gradient(
                    90deg,
                    transparent, transparent 2.5mm,
                    rgba(0,51,102,0.015) 2.5mm, rgba(0,51,102,0.015) 2.6mm
                );
            pointer-events: none;
            z-index: 0;
        }

        /* ── Left: QR Code area ── */
        .stamp-qr-area {
            width: 24mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2mm 1.5mm;
            position: relative;
            z-index: 1;
            border-right: 0.5px solid rgba(0,51,102,0.12);
            background: linear-gradient(180deg, rgba(0,51,102,0.02) 0%, rgba(255,255,255,0) 100%);
        }

        .stamp-qr-code {
            width: 18mm;
            height: 18mm;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stamp-qr-code img,
        .stamp-qr-code canvas,
        .stamp-qr-code svg {
            width: 100% !important;
            height: 100% !important;
        }

        .stamp-serial {
            margin-top: 1mm;
            font-family: 'Courier New', monospace;
            font-weight: 800;
            font-size: 5px;
            color: #003366;
            letter-spacing: 0.3px;
            text-align: center;
            white-space: nowrap;
        }

        /* ── Right: Info + Logo area ── */
        .stamp-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 1.5mm 2mm 1mm 2mm;
            position: relative;
            z-index: 1;
        }

        /* Header with logo */
        .stamp-top {
            display: flex;
            align-items: center;
            gap: 2mm;
            border-bottom: 0.5px solid rgba(0,51,102,0.15);
            padding-bottom: 1mm;
            margin-bottom: 1mm;
        }

        .stamp-logo {
            width: 10mm;
            height: auto;
            flex-shrink: 0;
        }

        .stamp-logo img {
            width: 100%;
            height: auto;
            object-fit: contain;
        }

        .stamp-titles {
            flex: 1;
            line-height: 1.25;
        }

        .stamp-country {
            font-size: 3.5px;
            font-weight: 600;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.6px;
        }

        .stamp-bureau {
            font-size: 5.5px;
            font-weight: 900;
            text-transform: uppercase;
            color: #003366;
            letter-spacing: 0.3px;
        }

        /* Data rows */
        .stamp-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.3mm;
        }

        .stamp-row {
            display: flex;
            align-items: baseline;
            font-size: 5.5px;
            line-height: 1.5;
        }

        .stamp-label {
            color: #64748b;
            width: 12mm;
            flex-shrink: 0;
            font-weight: 500;
        }

        .stamp-value {
            font-weight: 700;
            color: #1e293b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 26mm;
        }

        /* Footer */
        .stamp-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 0.5px solid rgba(0,51,102,0.1);
            padding-top: 0.5mm;
            margin-top: auto;
        }

        .stamp-footer-text {
            font-size: 3.5px;
            color: #94a3b8;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        /* Hologram diamond mark */
        .hologram {
            width: 7px;
            height: 7px;
            background: linear-gradient(135deg, #003366 0%, #0052a3 25%, #ffd700 50%, #0052a3 75%, #003366 100%);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            flex-shrink: 0;
        }

        /* DRC flag color bar */
        .flag-bar {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 1.2mm;
            z-index: 1;
        }
        .flag-bar span {
            display: block;
            height: 33.33%;
        }
        .flag-blue { background: #0070C0; }
        .flag-yellow { background: #FFD700; }
        .flag-red { background: #CE1126; }

        /* ── Page break helper ── */
        .page-break { page-break-after: always; break-after: page; }

        /* ── Print styles ── */
        @media print {
            .toolbar { display: none !important; }
            .page-wrap { padding: 0; }

            @page {
                size: A4 landscape;
                margin: 5mm;
            }

            body { background: #fff; }

            .stamp-sheet {
                width: 100%;
                border: none;
            }

            .stamp {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .stamp::after { display: none; } /* Hide scissors on print */

            .hologram, .flag-bar span {
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
            <h1>Batch Print Preview &mdash; {{ $order->order_number }}</h1>
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
        @foreach ($stamps->chunk(28) as $pageIndex => $pageStamps)
            <div class="stamp-sheet">
                @foreach ($pageStamps as $stamp)
                    <div class="stamp">
                        {{-- QR Code side --}}
                        <div class="stamp-qr-area">
                            <div class="stamp-qr-code" data-qr="{{ $stamp->serial_number }}"></div>
                            <div class="stamp-serial">{{ $stamp->serial_number }}</div>
                        </div>

                        {{-- Info side --}}
                        <div class="stamp-info">
                            {{-- DRC flag bar on the right edge --}}
                            <div class="flag-bar">
                                <span class="flag-blue"></span>
                                <span class="flag-yellow"></span>
                                <span class="flag-red"></span>
                            </div>

                            {{-- Header: Logo + Titles --}}
                            <div class="stamp-top">
                                <div class="stamp-logo">
                                    <img src="/KBS_logo.png" alt="RCEKIN" />
                                </div>
                                <div class="stamp-titles">
                                    <div class="stamp-country">R&eacute;publique D&eacute;mocratique du Congo</div>
                                    <div class="stamp-bureau">R&eacute;gie de Contr&ocirc;le et d'Estampillage</div>
                                </div>
                            </div>

                            {{-- Data --}}
                            <div class="stamp-details">
                                <div class="stamp-row">
                                    <span class="stamp-label">Produit:</span>
                                    <span class="stamp-value">{{ $order->product->name ?? 'N/A' }}</span>
                                </div>
                                <div class="stamp-row">
                                    <span class="stamp-label">Assujetti:</span>
                                    <span class="stamp-value">{{ $order->taxpayer->company_name ?? 'N/A' }}</span>
                                </div>
                                <div class="stamp-row">
                                    <span class="stamp-label">Type:</span>
                                    <span class="stamp-value">{{ $order->stampType->name ?? 'QR Code Standard' }}</span>
                                </div>
                            </div>

                            {{-- Footer --}}
                            <div class="stamp-bottom">
                                <span class="stamp-footer-text">Authentifi&eacute; &bull; S&eacute;curis&eacute; &bull; Tra&ccedil;able</span>
                                <div class="hologram"></div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            @if (!$loop->last)
                <div class="page-break"></div>
            @endif
        @endforeach
    </div>

    <script>
        // Generate real QR codes for every stamp
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.stamp-qr-code[data-qr]').forEach(function(el) {
                var serial = el.getAttribute('data-qr');
                // Verification URL as QR content
                var qrContent = window.location.origin + '/verify/' + encodeURIComponent(serial);
                try {
                    var qr = qrcode(0, 'M');
                    qr.addData(qrContent);
                    qr.make();
                    el.innerHTML = qr.createSvgTag({ cellSize: 2, margin: 0, scalable: true });
                    // Make the SVG fill the container
                    var svg = el.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('width', '100%');
                        svg.setAttribute('height', '100%');
                        svg.style.display = 'block';
                    }
                } catch(e) {
                    console.warn('QR generation failed for', serial, e);
                }
            });
        });
    </script>
</body>
</html>
