<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => [
                'required',
                'exists:stamp_orders,id',
            ],
            'payment_method_id' => [
                'required',
                'exists:payment_methods,id',
            ],
            'payment_provider' => ['nullable', 'string', 'max:100'],
            'payment_reference' => ['nullable', 'string', 'max:255'],
            'payment_date' => ['required', 'date'],

            // Conditional validation based on payment method type
            'phone_number' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^(\+243|0)[0-9]{9}$/',
                $this->requiredIfPaymentMethodType('mobile_money'),
            ],
            'bank_name' => [
                'nullable',
                'string',
                'max:100',
                $this->requiredIfPaymentMethodType('bank_transfer'),
            ],
            'bank_account_number' => [
                'nullable',
                'string',
                'max:100',
            ],
            'card_provider' => [
                'nullable',
                'string',
                Rule::in(['visa', 'mastercard', 'amex', 'other']),
                $this->requiredIfPaymentMethodType('card'),
            ],
        ];
    }

    protected function requiredIfPaymentMethodType(string $type)
    {
        return function ($attribute, $value, $fail) use ($type) {
            if ($this->paymentMethodType() === $type && empty($value)) {
                $fail("The {$attribute} is required for {$type} payments.");
            }
        };
    }

    protected function paymentMethodType(): ?string
    {
        if (!$this->payment_method_id) {
            return null;
        }

        $paymentMethod = \App\Models\PaymentMethod::find($this->payment_method_id);
        return $paymentMethod?->type;
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'The order ID is required.',
            'order_id.exists' => 'The selected order does not exist.',
            'payment_method_id.required' => 'Please select a payment method.',
            'payment_method_id.exists' => 'The selected payment method is invalid.',
            'payment_date.required' => 'The payment date is required.',
            'payment_date.date' => 'Please provide a valid payment date.',
            'phone_number.regex' => 'Please enter a valid phone number (format: +243XXXXXXXXX or 0XXXXXXXXX).',
        ];
    }

    protected function prepareForValidation()
    {
        // Map payment_reference to transaction_reference if needed
        if ($this->has('payment_reference') && !$this->has('transaction_reference')) {
            $this->merge([
                'transaction_reference' => $this->payment_reference
            ]);
        }
    }
}