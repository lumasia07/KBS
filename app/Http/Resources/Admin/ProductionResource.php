<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'taxpayer' => [
                'id' => $this->taxpayer->id,
                'name' => $this->taxpayer->company_name,
                'tin' => $this->taxpayer->taxpayer_number,
            ],
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'code' => $this->product->code,
            ],
            'stamp_type' => [
                'id' => $this->stampType->id,
                'name' => $this->stampType->name,
                'code' => $this->stampType->code,
            ],
            'quantity' => $this->quantity,
            'status' => $this->status,
            'estimated_delivery_date' => $this->estimated_delivery_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'stamps_count' => $this->whenCounted('stamps'),
        ];
    }
}