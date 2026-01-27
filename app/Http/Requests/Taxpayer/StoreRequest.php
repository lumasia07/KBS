<?php

namespace App\Http\Requests\Taxpayer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Tax Identification Information
            'tax_identification_number' => [
                'required',
                'string',
                'max:50',
                'unique:taxpayers,tax_identification_number'
            ],

            // RCCM Number (Trade Register)
            'rccm_number' => [
                'required',
                'string',
                'max:50',
                'unique:taxpayers,trade_register_number'
            ],

            // Company Information
            'company_name' => [
                'required',
                'string',
                'max:255',
                'unique:taxpayers,company_name'
            ],
            'legal_form_id' => [
                'required',
                'exists:legal_forms,id'
            ],
            'sector_id' => [
                'required',
                'exists:business_sectors,id'
            ],

            // Address Information with foreign keys
            'district_id' => [
                'required',
                'exists:districts,id'
            ],
            'commune_id' => [
                'required',
                'exists:communes,id'
            ],
            'quartier_id' => [
                'nullable',
                'exists:quartiers,id'
            ],
            'avenue' => [
                'nullable',
                'string',
                'max:100'
            ],
            'number' => [
                'nullable',
                'string',
                'max:20'
            ],
            'plot_number' => [
                'nullable',
                'string',
                'max:50'
            ],
            'physical_address' => [
                'required',
                'string',
                'max:500'
            ],

            // Legal Representative Information
            'legal_representative_name' => [
                'required',
                'string',
                'max:255'
            ],
            'legal_representative_email' => [
                'required',
                'email',
                'max:255'
            ],
            'legal_representative_phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^\+?[0-9\s\-\(\)]+$/'
            ],
            'legal_representative_id_number' => [
                'required',
                'string',
                'max:50'
            ],

            // Company Information (optional fields)
            'company_size_id' => [
                'required',
                'exists:company_sizes,id'
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:taxpayers,email'
            ],
            'phone_number' => [
                'required',
                'string',
                'max:20',
                'regex:/^\+?[0-9\s\-\(\)]+$/'
            ],
            'alternate_phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^\+?[0-9\s\-\(\)]+$/'
            ],

            // Banking Information (optional)
            'bank_name' => [
                'nullable',
                'string',
                'max:100'
            ],
            'bank_account_number' => [
                'nullable',
                'string',
                'max:50'
            ],
            'bank_account_holder' => [
                'nullable',
                'string',
                'max:255'
            ],

            // Operational Contact Information (optional)
            'operational_contact_name' => [
                'nullable',
                'string',
                'max:255'
            ],
            'operational_contact_email' => [
                'nullable',
                'email',
                'max:255'
            ],
            'operational_contact_phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^\+?[0-9\s\-\(\)]+$/'
            ],

            // Trade Register Details (optional)
            'trade_register_issue_date' => [
                'nullable',
                'date',
                'before_or_equal:today'
            ],

            // Registration Status (auto-set default)
            'registration_status' => [
                'sometimes',
                Rule::in(['pending', 'verified', 'rejected', 'suspended', 'active'])
            ],

            // Products (optional)
            'products' => [
                'nullable',
                'array'
            ],
            'products.*.product_id' => [
                'required_with:products',
                'exists:products,id'
            ],
            'products.*.registration_date' => [
                'required_with:products',
                'date',
                'before_or_equal:today'
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
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tax_identification_number.unique' => 'This tax identification number is already registered.',
            'rccm_number.unique' => 'This RCCM number is already registered.',
            'company_name.unique' => 'This company name is already registered.',
            'email.unique' => 'This email is already registered.',

            'legal_form_id.exists' => 'The selected legal form is invalid.',
            'sector_id.exists' => 'The selected business sector is invalid.',
            'company_size_id.exists' => 'The selected company size is invalid.',
            'district_id.exists' => 'The selected district is invalid.',
            'commune_id.exists' => 'The selected commune is invalid.',
            'quartier_id.exists' => 'The selected quartier is invalid.',

            'phone_number.regex' => 'Please enter a valid phone number.',
            'alternate_phone.regex' => 'Please enter a valid alternate phone number.',
            'legal_representative_phone.regex' => 'Please enter a valid phone number for legal representative.',
            'operational_contact_phone.regex' => 'Please enter a valid phone number for operational contact.',

            'trade_register_issue_date.before_or_equal' => 'Trade register issue date cannot be in the future.',

            'products.*.product_id.required_with' => 'Product ID is required for each product.',
            'products.*.product_id.exists' => 'Selected product does not exist.',
            'products.*.registration_date.required_with' => 'Registration date is required for each product.',
            'products.*.registration_date.before_or_equal' => 'Product registration date cannot be in the future.',
            'products.*.health_certificate_expiry.after' => 'Health certificate expiry date must be in the future.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'tax_identification_number' => 'tax identification number',
            'rccm_number' => 'RCCM number',
            'company_name' => 'company name',
            'legal_form_id' => 'legal form',
            'sector_id' => 'business sector',
            'company_size_id' => 'company size',
            'district_id' => 'district',
            'commune_id' => 'commune',
            'quartier_id' => 'quartier',
            'avenue' => 'avenue',
            'number' => 'number',
            'plot_number' => 'plot number',
            'physical_address' => 'physical address',
            'legal_representative_name' => 'legal representative name',
            'legal_representative_email' => 'legal representative email',
            'legal_representative_phone' => 'legal representative phone',
            'legal_representative_id_number' => 'legal representative ID number',
            'email' => 'company email',
            'phone_number' => 'company phone number',
            'alternate_phone' => 'alternate phone',
            'bank_name' => 'bank name',
            'bank_account_number' => 'bank account number',
            'bank_account_holder' => 'bank account holder',
            'operational_contact_name' => 'operational contact name',
            'operational_contact_email' => 'operational contact email',
            'operational_contact_phone' => 'operational contact phone',
            'trade_register_issue_date' => 'trade register issue date',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Map rccm_number to trade_register_number for database
        $this->merge([
            'tax_identification_number' => trim($this->tax_identification_number ?? ''),
            'trade_register_number' => trim($this->rccm_number ?? ''),
            'company_name' => trim($this->company_name ?? ''),
            'avenue' => trim($this->avenue ?? ''),
            'number' => trim($this->number ?? ''),
            'plot_number' => trim($this->plot_number ?? ''),
            'physical_address' => trim($this->physical_address ?? ''),
            'legal_representative_name' => trim($this->legal_representative_name ?? ''),
            'legal_representative_email' => strtolower(trim($this->legal_representative_email ?? '')),
            'legal_representative_phone' => $this->formatPhoneNumber($this->legal_representative_phone ?? ''),
            'legal_representative_id_number' => trim($this->legal_representative_id_number ?? ''),

            // Optional fields
            'email' => isset($this->email) ? strtolower(trim($this->email)) : null,
            'phone_number' => isset($this->phone_number) ? $this->formatPhoneNumber($this->phone_number) : null,
            'alternate_phone' => isset($this->alternate_phone) ? $this->formatPhoneNumber($this->alternate_phone) : null,
            'operational_contact_phone' => isset($this->operational_contact_phone) ? $this->formatPhoneNumber($this->operational_contact_phone) : null,
            'bank_name' => isset($this->bank_name) ? trim($this->bank_name) : null,
            'bank_account_number' => isset($this->bank_account_number) ? trim($this->bank_account_number) : null,
            'bank_account_holder' => isset($this->bank_account_holder) ? trim($this->bank_account_holder) : null,
            'operational_contact_name' => isset($this->operational_contact_name) ? trim($this->operational_contact_name) : null,
            'operational_contact_email' => isset($this->operational_contact_email) ? strtolower(trim($this->operational_contact_email)) : null,
        ]);
    }

    /**
     * Format phone number by removing all non-numeric characters except plus sign.
     */
    private function formatPhoneNumber(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }

        // Remove all spaces, dashes, and parentheses
        return preg_replace('/[\s\-\(\)]/', '', $phone);
    }

    /**
     * Get the validated data with additional processing.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Set default registration status if not provided
        if (!isset($validated['registration_status'])) {
            $validated['registration_status'] = 'pending';
        }

        // Set registration date to today if not provided
        if (!isset($validated['registration_date'])) {
            $validated['registration_date'] = now()->toDateString();
        }

        return $validated;
    }
}