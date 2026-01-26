<?php

namespace App\Http\Requests\Taxpayer;

use Illuminate\Validation\Rule;

class UpdateRequest extends StoreRequest
{
    /**
     * Get the validation rules that apply to the request.
     * Override parent rules for update scenario.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $taxpayerId = $this->route('taxpayer'); // Assuming route parameter is 'taxpayer'

        // Get parent rules
        $rules = parent::rules();

        // Modify rules for update scenario
        $rules['tax_identification_number'] = [
            'sometimes',
            'string',
            'max:50',
            Rule::unique('taxpayers')->ignore($taxpayerId)
        ];

        $rules['rccm_number'] = [
            'sometimes',
            'string',
            'max:50',
            Rule::unique('taxpayers', 'trade_register_number')->ignore($taxpayerId)
        ];

        $rules['company_name'] = [
            'sometimes',
            'string',
            'max:255',
            Rule::unique('taxpayers')->ignore($taxpayerId)
        ];

        $rules['email'] = [
            'sometimes',
            'email',
            'max:255',
            Rule::unique('taxpayers')->ignore($taxpayerId)
        ];

        // Change required to sometimes for update
        $requiredFields = [
            'legal_form_id',
            'sector_id',
            'district_id',
            'commune_id',
            'physical_address',
            'legal_representative_name',
            'legal_representative_email',
            'legal_representative_phone',
            'legal_representative_id_number'
        ];

        foreach ($requiredFields as $field) {
            if (isset($rules[$field])) {
                $rules[$field][0] = 'sometimes';
            }
        }

        // Add update-specific rules
        $updateSpecificRules = [
            // Registration Status (admin only)
            'registration_status' => [
                'sometimes',
                Rule::in(['pending', 'verified', 'rejected', 'suspended', 'active'])
            ],
            'rejection_reason' => [
                'nullable',
                'required_if:registration_status,rejected',
                'string',
                'max:500'
            ],
            'verification_date' => [
                'nullable',
                'date',
                'before_or_equal:today'
            ],
            'verified_by' => [
                'nullable',
                'exists:users,id'
            ],

            // API Key Management (admin only)
            'regenerate_api_key' => [
                'boolean'
            ],

            // Products update (different from create)
            'products' => [
                'nullable',
                'array'
            ],
            'products.*.product_id' => [
                'required_with:products',
                'exists:products,id'
            ],
            'products.*.action' => [
                'required_with:products',
                Rule::in(['attach', 'detach', 'update'])
            ],
            'products.*.registration_date' => [
                'required_if:products.*.action,attach,update',
                'date',
                'before_or_equal:today'
            ],
            'products.*.status' => [
                'nullable',
                Rule::in(['active', 'inactive', 'suspended'])
            ],
            'products.*.health_certificate_number' => [
                'nullable',
                'string',
                'max:100'
            ],
            'products.*.health_certificate_expiry' => [
                'nullable',
                'date',
                'after:today'
            ],
            'products.*.notes' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];

        // Merge update-specific rules
        return array_merge($rules, $updateSpecificRules);
    }

    /**
     * Get custom messages for validator errors.
     * Extend parent messages with update-specific ones.
     */
    public function messages(): array
    {
        $parentMessages = parent::messages();

        $updateMessages = [
            'rejection_reason.required_if' => 'Rejection reason is required when registration status is rejected.',
            'verification_date.before_or_equal' => 'Verification date cannot be in the future.',
            'products.*.action.required_with' => 'Action is required for each product (attach, detach, or update).',
            'products.*.registration_date.required_if' => 'Registration date is required when attaching or updating a product.',
        ];

        return array_merge($parentMessages, $updateMessages);
    }

    /**
     * Prepare the data for validation.
     * Override to handle update-specific preparation.
     */
    protected function prepareForValidation(): void
    {
        // Call parent preparation
        parent::prepareForValidation();

        // Additional update-specific preparation
        if ($this->has('rccm_number')) {
            $this->merge([
                'trade_register_number' => trim($this->rccm_number),
            ]);
        }
    }

    /**
     * Get the validated data with additional processing.
     * Override to remove automatic defaults for update.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Remove the automatic registration_date for update
        // Only set it if explicitly provided
        if (!isset($this->registration_date)) {
            unset($validated['registration_date']);
        }

        return $validated;
    }
}