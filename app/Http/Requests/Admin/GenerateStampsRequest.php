<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GenerateStampsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->can('generate_stamps');
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:stamp_orders,id'],
            'confirm_production' => ['required', 'boolean', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'confirm_production.accepted' => 'You must confirm that you want to start production for this order.',
        ];
    }
}