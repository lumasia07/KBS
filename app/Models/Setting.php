<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'category',
        'value',
        'description',
        'type',
        'is_public',
        'is_encrypted'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_encrypted' => 'boolean'
    ];

    public function getValueAttribute($value)
    {
        if ($this->is_encrypted && $value) {
            return decrypt($value);
        }

        if ($value === null) {
            return null;
        }

        switch ($this->type) {
            case 'integer':
                return (int) $value;
            case 'float':
                return (float) $value;
            case 'boolean':
                return (bool) $value;
            case 'json':
                return json_decode($value, true);
            case 'array':
                return json_decode($value, true);
            default:
                return $value;
        }
    }

    public function setValueAttribute($value)
    {
        if ($value === null) {
            $this->attributes['value'] = null;
            return;
        }

        switch ($this->type) {
            case 'integer':
                $this->attributes['value'] = (int) $value;
                break;
            case 'float':
                $this->attributes['value'] = (float) $value;
                break;
            case 'boolean':
                $this->attributes['value'] = (bool) $value ? '1' : '0';
                break;
            case 'json':
            case 'array':
                $this->attributes['value'] = json_encode($value);
                break;
            default:
                $this->attributes['value'] = (string) $value;
        }

        if ($this->is_encrypted && $this->attributes['value']) {
            $this->attributes['value'] = encrypt($this->attributes['value']);
        }
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopePrivate($query)
    {
        return $query->where('is_public', false);
    }

    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setValue($key, $value, $type = null, $category = 'general', $description = null)
    {
        $setting = self::where('key', $key)->first();

        if (!$setting) {
            $setting = new self();
            $setting->key = $key;
            $setting->category = $category;
            $setting->type = $type ?? 'string';
            $setting->description = $description;
        }

        $setting->value = $value;
        $setting->save();

        return $setting;
    }

    public static function getCategory($category)
    {
        return self::where('category', $category)->get()->keyBy('key');
    }
}