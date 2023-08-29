<?php
declare(strict_types=1);

namespace ExifReader\CameraData;

use ExifReader\ExifRational;

class FocalLengthIn35MmFilm
{
    /** @var int|float */
    private $value;

    private function __construct(int|float $value)
    {
        $this->value = $value;
    }

    public static function fromInt(int|float $value): self
    {
        if ($value < 0) {
            return self::undefined();
        }

        return new self($value);
    }

    public static function undefined(): self
    {
        return new self(0);
    }

    public function getValue(): int|float
    {
        return $this->value;
    }

    public function __toString(): string
    {
        return (string)$this->value;
    }
}