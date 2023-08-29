<?php
declare(strict_types=1);

namespace ExifReader;

use ExifReader\GeoLocation\Altitude;
use ExifReader\GeoLocation\Direction;
use ExifReader\GeoLocation\Latitude;
use ExifReader\GeoLocation\Longitude;

class GeoLocation
{
    /** @var Latitude */
    private $latitude;

    /** @var Longitude */
    private $longitude;

    /** @var Altitude */
    private $altitude;

    private $direction;

    private function __construct(
        Latitude $latitude,
        Longitude $longitude,
        Altitude $altitude,
        Direction $direction
    ) {
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->altitude = $altitude;
        $this->direction = $direction;
    }

    public static function fromExifArray(array $exifArray): self
    {
        return new self(
            isset($exifArray['GPSLatitude']) && isset($exifArray['GPSLatitudeRef'])
                ? Latitude::fromExifArray($exifArray['GPSLatitude'], $exifArray['GPSLatitudeRef'])
                : Latitude::undefined(),
            isset($exifArray['GPSLongitude']) && isset($exifArray['GPSLongitudeRef'])
                ? Longitude::fromExifArray($exifArray['GPSLongitude'], $exifArray['GPSLongitudeRef'])
                : Longitude::undefined(),
            isset($exifArray['GPSAltitude'])
                ? Altitude::fromString($exifArray['GPSAltitude'])
                : Altitude::undefined(),
            isset($exifArray['GPSImgDirection'])
                ? Direction::fromString($exifArray['GPSImgDirection'])
                : Direction::undefined()
        );
    }

    public function getLatitude(): Latitude
    {
        return $this->latitude;
    }

    public function getLongitude(): Longitude
    {
        return $this->longitude;
    }

    public function getAltitude(): Altitude
    {
        return $this->altitude;
    }
    
    public function getDirection(): Direction
    {
        return $this->direction;
    }
}