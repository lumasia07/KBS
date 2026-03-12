<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification — RCEKIN</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            background: #f1f5f9;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ── Header bar ── */
        .header {
            background: linear-gradient(135deg, #003366 0%, #0d1b3e 50%, #1a0a2e 100%);
            color: #fff;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .header img { height: 44px; width: auto; }
        .header-text h1 { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
        .header-text p { font-size: 11px; opacity: .7; margin-top: 2px; }

        /* ── Main container ── */
        .container {
            flex: 1;
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
            padding: 24px 16px 40px;
        }

        /* ── Result card ── */
        .result-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }

        /* Status banner */
        .status-banner {
            padding: 28px 24px;
            text-align: center;
            color: #fff;
        }
        .status-banner.valid     { background: linear-gradient(135deg, #059669, #10b981); }
        .status-banner.invalid   { background: linear-gradient(135deg, #dc2626, #ef4444); }
        .status-banner.warning   { background: linear-gradient(135deg, #d97706, #f59e0b); }
        .status-banner.not-found { background: linear-gradient(135deg, #6b7280, #9ca3af); }

        .status-icon {
            width: 64px; height: 64px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 12px;
            font-size: 32px;
        }
        .status-title { font-size: 22px; font-weight: 800; }
        .status-subtitle { font-size: 13px; opacity: .85; margin-top: 4px; }

        /* Details section */
        .details { padding: 24px; }
        .details h3 {
            font-size: 12px; font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
        }
        .detail-value {
            font-size: 13px;
            color: #1e293b;
            font-weight: 700;
            text-align: right;
            max-width: 60%;
            word-break: break-word;
        }

        /* Badge */
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-valid   { background: #d1fae5; color: #065f46; }
        .badge-invalid { background: #fee2e2; color: #991b1b; }
        .badge-warning { background: #fef3c7; color: #92400e; }

        /* Serial number */
        .serial-display {
            font-family: 'Courier New', monospace;
            font-size: 15px;
            font-weight: 800;
            color: #003366;
            letter-spacing: 0.5px;
        }

        /* Verification count */
        .scan-count {
            text-align: center;
            padding: 14px 24px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }
        .scan-count strong { color: #64748b; }

        /* ── Not found state ── */
        .not-found-body {
            padding: 32px 24px;
            text-align: center;
        }
        .not-found-body p {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        /* ── Manual search form ── */
        .search-section {
            margin-top: 20px;
            background: #fff;
            border-radius: 16px;
            padding: 20px 24px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .search-section h3 {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .search-form {
            display: flex;
            gap: 8px;
        }
        .search-form input {
            flex: 1;
            padding: 10px 14px;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-form input:focus { border-color: #003366; }
        .search-form button {
            padding: 10px 20px;
            background: #003366;
            color: #fff;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
        }

        /* ── Footer ── */
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 11px;
            color: #94a3b8;
        }
        .footer a { color: #003366; text-decoration: none; font-weight: 600; }

        /* ── DRC flag accent ── */
        .flag-accent {
            height: 3px;
            display: flex;
        }
        .flag-accent span { flex: 1; }
        .flag-blue   { background: #0070C0; }
        .flag-yellow { background: #FFD700; }
        .flag-red    { background: #CE1126; }
    </style>
</head>
<body>
    {{-- Flag accent --}}
    <div class="flag-accent">
        <span class="flag-blue"></span>
        <span class="flag-yellow"></span>
        <span class="flag-red"></span>
    </div>

    {{-- Header --}}
    <div class="header">
        <img src="/KBS_logo.png" alt="RCEKIN">
        <div class="header-text">
            <h1>RCEKIN &mdash; Vérification</h1>
            <p>Régie de Contrôle et d'Estampillage de Kinshasa</p>
        </div>
    </div>

    <div class="container">

        @if ($found && $stamp)
            {{-- ✅ Stamp found — display result --}}
            <div class="result-card">
                @php
                    $bannerClass = match($result) {
                        'valid'         => 'valid',
                        'expired'       => 'warning',
                        'not_activated' => 'warning',
                        'reported_lost' => 'invalid',
                        'counterfeit'   => 'invalid',
                        default         => 'invalid',
                    };

                    $icon = match($result) {
                        'valid'         => '✓',
                        'expired'       => '⏱',
                        'not_activated' => '⏳',
                        'reported_lost' => '⚠',
                        'counterfeit'   => '✕',
                        default         => '✕',
                    };

                    $title = match($result) {
                        'valid'         => 'Produit Authentique',
                        'expired'       => 'Estampille Expirée',
                        'not_activated' => 'Non Activée',
                        'reported_lost' => 'Estampille Déclarée Perdue',
                        'counterfeit'   => 'Estampille Suspecte',
                        default         => 'Estampille Invalide',
                    };

                    $subtitle = match($result) {
                        'valid'         => 'Cette estampille est valide et enregistrée dans le système RCEKIN.',
                        'expired'       => 'Cette estampille a dépassé sa date de validité.',
                        'not_activated' => 'Cette estampille n\'a pas encore été activée.',
                        'reported_lost' => 'Cette estampille a été déclarée perdue ou volée.',
                        'counterfeit'   => 'Cette estampille est bloquée. Contactez les autorités.',
                        default         => 'Cette estampille n\'est pas reconnue comme valide.',
                    };

                    $badgeClass = match($result) {
                        'valid'                          => 'badge-valid',
                        'expired', 'not_activated'       => 'badge-warning',
                        default                          => 'badge-invalid',
                    };

                    $badgeText = match($result) {
                        'valid'         => 'Authentique',
                        'expired'       => 'Expiré',
                        'not_activated' => 'Non activé',
                        'reported_lost' => 'Perdue',
                        'counterfeit'   => 'Suspect',
                        default         => 'Invalide',
                    };
                @endphp

                {{-- Status banner --}}
                <div class="status-banner {{ $bannerClass }}">
                    <div class="status-icon">{!! $icon !!}</div>
                    <div class="status-title">{{ $title }}</div>
                    <div class="status-subtitle">{{ $subtitle }}</div>
                </div>

                {{-- Product details --}}
                <div class="details">
                    <h3>Détails de l'estampille</h3>

                    <div class="detail-row">
                        <span class="detail-label">N° Série</span>
                        <span class="detail-value serial-display">{{ $stamp->serial_number }}</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Statut</span>
                        <span class="detail-value"><span class="badge {{ $badgeClass }}">{{ $badgeText }}</span></span>
                    </div>

                    @if ($stamp->product)
                        <div class="detail-row">
                            <span class="detail-label">Produit</span>
                            <span class="detail-value">{{ $stamp->product->name }}</span>
                        </div>
                    @endif

                    @if ($stamp->taxpayer)
                        <div class="detail-row">
                            <span class="detail-label">Assujetti</span>
                            <span class="detail-value">{{ $stamp->taxpayer->company_name }}</span>
                        </div>
                    @endif

                    @if ($stamp->stampType)
                        <div class="detail-row">
                            <span class="detail-label">Type</span>
                            <span class="detail-value">{{ $stamp->stampType->name }}</span>
                        </div>
                    @endif

                    @if ($stamp->production_date)
                        <div class="detail-row">
                            <span class="detail-label">Date de production</span>
                            <span class="detail-value">{{ $stamp->production_date->format('d/m/Y') }}</span>
                        </div>
                    @endif

                    @if ($stamp->expiry_date)
                        <div class="detail-row">
                            <span class="detail-label">Expiration</span>
                            <span class="detail-value">{{ $stamp->expiry_date->format('d/m/Y') }}</span>
                        </div>
                    @endif
                </div>

                {{-- Scan count --}}
                <div class="scan-count">
                    Scannée <strong>{{ $stamp->verification_count ?? 1 }}</strong> fois
                    &bull; Dernière vérification: <strong>{{ now()->format('d/m/Y H:i') }}</strong>
                </div>
            </div>
        @else
            {{-- ❌ Not found --}}
            <div class="result-card">
                <div class="status-banner not-found">
                    <div class="status-icon">?</div>
                    <div class="status-title">Estampille Introuvable</div>
                    <div class="status-subtitle">Ce numéro de série n'est pas enregistré dans le système RCEKIN.</div>
                </div>

                <div class="not-found-body">
                    <p>
                        L'estampille que vous avez scannée ne correspond à aucun enregistrement.
                        Si vous pensez que ce produit devrait être estampillé, veuillez contacter
                        la RCEKIN ou signaler ce produit aux autorités compétentes.
                    </p>
                </div>
            </div>
        @endif

        {{-- Manual search --}}
        <div class="search-section">
            <h3>Vérifier manuellement</h3>
            <form class="search-form" method="GET" action="" id="searchForm">
                <input type="text"
                       name="serial"
                       placeholder="Entrez le numéro de série..."
                       required
                       pattern="[A-Za-z0-9\-]+"
                       maxlength="100"
                       autocomplete="off" />
                <button type="submit">Vérifier</button>
            </form>
        </div>
    </div>

    {{-- Footer --}}
    <div class="footer">
        &copy; {{ date('Y') }} RCEKIN &mdash; Régie de Contrôle et d'Estampillage de Kinshasa<br>
        <a href="https://www.rcekin.cd" target="_blank" rel="noopener">www.rcekin.cd</a>
    </div>

    <script>
        document.getElementById('searchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var serial = this.querySelector('input[name="serial"]').value.trim();
            if (serial) {
                window.location.href = '/verify/' + encodeURIComponent(serial);
            }
        });
    </script>
</body>
</html>
