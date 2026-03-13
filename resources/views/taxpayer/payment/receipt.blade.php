<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture de paiement - {{ $payment->invoice_number }}</title>
    <style>
        :root {
            --bleu-principal: #0b3ea8;
            --bleu-secondaire: #eaf0ff;
            --texte-principal: #1f2937;
            --texte-secondaire: #4b5563;
            --bordure: #d1d5db;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--texte-principal);
            background: #f4f6fa;
        }

        .actions {
            max-width: 980px;
            margin: 20px auto 0;
            padding: 0 16px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .btn {
            border: 1px solid var(--bleu-principal);
            background: var(--bleu-principal);
            color: #fff;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 14px;
            cursor: pointer;
        }

        .btn.secondary {
            background: #fff;
            color: var(--bleu-principal);
        }

        .page {
            max-width: 980px;
            margin: 12px auto 28px;
            background: #fff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
            padding: 28px 34px 34px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
        }

        .identity {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .identity img {
            width: 112px;
            height: 112px;
            object-fit: contain;
        }

        .title-block h1 {
            margin: 0;
            font-size: 34px;
            color: var(--bleu-principal);
            letter-spacing: 0.4px;
            line-height: 1.18;
            text-transform: uppercase;
            max-width: 620px;
        }

        .title-block p {
            margin: 6px 0 0;
            color: #475569;
            font-weight: 600;
            letter-spacing: 0.2px;
            font-size: 14px;
        }

        .status-badge {
            border: 2px solid var(--bleu-principal);
            color: var(--bleu-principal);
            font-weight: 700;
            border-radius: 999px;
            padding: 8px 14px;
            white-space: nowrap;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
        }

        .status-badge.completed {
            border-color: #16a34a;
            background: #ecfdf3;
            color: #15803d;
        }

        .status-badge.pending {
            border-color: #d97706;
            background: #fffbeb;
            color: #b45309;
        }

        .status-badge.failed,
        .status-badge.refunded {
            border-color: #dc2626;
            background: #fef2f2;
            color: #b91c1c;
        }

        .status-icon {
            width: 16px;
            height: 16px;
            display: inline-block;
        }

        .divider {
            border: 0;
            border-top: 3px solid var(--bleu-principal);
            margin: 20px 0 18px;
        }

        .meta {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }

        .meta .item {
            background: var(--bleu-secondaire);
            border: 1px solid #dbe4ff;
            border-radius: 8px;
            padding: 10px;
        }

        .label {
            font-size: 12px;
            color: var(--texte-secondaire);
            margin-bottom: 4px;
        }

        .value {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            word-break: break-word;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 8px;
        }

        .card {
            border: 1px solid var(--bordure);
            border-left: 5px solid var(--bleu-principal);
            border-radius: 8px;
            padding: 14px 14px 10px;
            min-height: 184px;
        }

        .card h3 {
            margin: 0 0 10px;
            color: var(--bleu-principal);
            font-size: 22px;
        }

        .line {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            border-bottom: 1px dashed #e5e7eb;
            padding: 6px 0;
            font-size: 14px;
        }

        .line:last-child {
            border-bottom: 0;
        }

        .line .k {
            color: var(--texte-secondaire);
            min-width: 38%;
        }

        .line .v {
            font-weight: 600;
            text-align: right;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            border: 1px solid var(--bordure);
        }

        thead th {
            background: #f8fafc;
            color: #334155;
            text-align: left;
            font-size: 13px;
            border-bottom: 1px solid var(--bordure);
            padding: 10px;
        }

        tbody td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }

        .right {
            text-align: right;
        }

        .totals {
            width: 360px;
            margin-left: auto;
            margin-top: 14px;
            border: 1px solid var(--bordure);
            border-radius: 8px;
            overflow: hidden;
        }

        .totals .row {
            display: flex;
            justify-content: space-between;
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }

        .totals .row:last-child {
            border-bottom: 0;
        }

        .totals .grand {
            background: var(--bleu-secondaire);
            font-weight: 700;
            color: var(--bleu-principal);
            font-size: 16px;
        }

        .note {
            margin-top: 18px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            font-size: 13px;
            color: #475569;
        }

        @media print {
            body {
                background: #fff;
            }

            .actions {
                display: none;
            }

            .page {
                box-shadow: none;
                border: 0;
                margin: 0;
                max-width: 100%;
                padding: 12mm;
            }
        }

        @media (max-width: 820px) {
            .identity img {
                width: 84px;
                height: 84px;
            }

            .title-block h1 {
                font-size: 26px;
            }

            .meta {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .cards {
                grid-template-columns: 1fr;
            }

            .totals {
                width: 100%;
            }
        }
    </style>
</head>
<body>
@php
    $taxpayer = $payment->taxpayer;
    $order = $payment->order;
    $provider = $payment->payment_provider_response ?? [];
    $status = $payment->status ?? 'inconnu';

    $formatMoney = static function ($amount) {
        return 'FC ' . number_format((float) ($amount ?? 0), 0, ',', ' ');
    };

    $formatDate = static function ($date) {
        return $date ? \Illuminate\Support\Carbon::parse($date)->format('d/m/Y H:i') : '-';
    };

    $statuts = [
        'completed' => 'Paiement confirme',
        'pending' => 'Paiement en attente',
        'failed' => 'Paiement echoue',
        'refunded' => 'Paiement rembourse',
    ];
@endphp

<div class="actions">
    <button class="btn secondary" onclick="window.close()">Fermer</button>
    <button class="btn" onclick="window.print()">Imprimer</button>
</div>

<main class="page">
    <header class="header">
        <div class="identity">
            <img src="/KBS_logo.png" alt="Logo officiel KISA">
            <div class="title-block">
                <h1>Systeme integre d'estampillage de Kinshasa</h1>
                <p>Facture officielle de paiement</p>
            </div>
        </div>
        <div class="status-badge {{ $status }}">
            @if($status === 'completed')
                <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            @endif
            <span>{{ $statuts[$status] ?? ucfirst($status) }}</span>
        </div>
    </header>

    <hr class="divider">

    <section class="meta">
        <div class="item">
            <div class="label">Facture</div>
            <div class="value">{{ $payment->invoice_number ?? '-' }}</div>
        </div>
        <div class="item">
            <div class="label">Commande</div>
            <div class="value">{{ $order?->order_number ?? '-' }}</div>
        </div>
        <div class="item">
            <div class="label">Date de paiement</div>
            <div class="value">{{ $formatDate($payment->payment_date) }}</div>
        </div>
        <div class="item">
            <div class="label">Date de creation</div>
            <div class="value">{{ $formatDate($payment->created_at) }}</div>
        </div>
    </section>

    <section class="cards">
        <article class="card">
            <h3>Details du contribuable</h3>
            <div class="line"><span class="k">Societe</span><span class="v">{{ $taxpayer?->company_name ?? '-' }}</span></div>
            <div class="line"><span class="k">NIF</span><span class="v">{{ $taxpayer?->tax_identification_number ?? '-' }}</span></div>
            <div class="line"><span class="k">Adresse</span><span class="v">{{ $taxpayer?->physical_address ?? '-' }}</span></div>
            <div class="line"><span class="k">Telephone</span><span class="v">{{ $taxpayer?->phone_number ?? '-' }}</span></div>
            <div class="line"><span class="k">Email</span><span class="v">{{ $taxpayer?->email ?? '-' }}</span></div>
            <div class="line"><span class="k">Representant legal</span><span class="v">{{ $taxpayer?->legal_representative_name ?? '-' }}</span></div>
        </article>

        <article class="card">
            <h3>Details de transaction</h3>
            <div class="line"><span class="k">ID transaction</span><span class="v">{{ $payment->transaction_id ?? '-' }}</span></div>
            <div class="line"><span class="k">Methode de paiement</span><span class="v">{{ $payment->paymentMethod?->name ?? '-' }}</span></div>
            <div class="line"><span class="k">Fournisseur</span><span class="v">{{ $payment->payment_provider ?? ($provider['payment_method'] ?? '-') }}</span></div>
            <div class="line"><span class="k">Reference</span><span class="v">{{ $provider['reference'] ?? ($payment->transaction_id ?? '-') }}</span></div>
            <div class="line"><span class="k">Banque</span><span class="v">{{ $provider['bank_name'] ?? ($taxpayer?->bank_name ?? '-') }}</span></div>
            <div class="line"><span class="k">Compte bancaire</span><span class="v">{{ $provider['bank_account_number'] ?? ($taxpayer?->bank_account_number ?? '-') }}</span></div>
            <div class="line"><span class="k">Date de confirmation</span><span class="v">{{ $formatDate($payment->confirmation_date) }}</span></div>
        </article>
    </section>

    <table>
        <thead>
        <tr>
            <th>Description</th>
            <th class="right">Quantite</th>
            <th class="right">Prix unitaire</th>
            <th class="right">Montant</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                Droit de timbre
                @if($order?->product)
                    <br><small>Produit: {{ $order->product->name }}</small>
                @endif
            </td>
            <td class="right">{{ number_format((int) ($order?->quantity ?? 0), 0, ',', ' ') }}</td>
            <td class="right">{{ $formatMoney($order?->unit_price ?? 0) }}</td>
            <td class="right">{{ $formatMoney($payment->amount) }}</td>
        </tr>
        </tbody>
    </table>

    <section class="totals">
        <div class="row"><span>Sous-total</span><span>{{ $formatMoney($payment->amount) }}</span></div>
        <div class="row"><span>Taxe</span><span>{{ $formatMoney($payment->tax_amount) }}</span></div>
        <div class="row"><span>Penalite</span><span>{{ $formatMoney($payment->penalty_amount) }}</span></div>
        <div class="row grand"><span>Total paye</span><span>{{ $formatMoney($payment->total_amount) }}</span></div>
    </section>

    <div class="note">
        Cette facture tient lieu de recu officiel de paiement. En cas de litige, veuillez communiquer le numero de facture <strong>{{ $payment->invoice_number }}</strong> au service de support.
    </div>
</main>
</body>
</html>