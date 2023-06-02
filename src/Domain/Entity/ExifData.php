<?php
declare(strict_types = 1);

namespace App\Domain\Entity;

class ExifData
{
    /** @var float|null */
    private $latitude;

    /** @var float|null */
    private $longitude;

    /** @var float|null */
    private $altitude;

    /** @var string|null */
    private $make;

    /** @var string|null */
    private $model;

    /** @var string|null */
    private $exposure;

    /** @var string|null */
    private $aperture;

    /** @var string|null */
    private $focalLength;

    /** @var string|null */
    private $ISO;

    /** @var \DateTimeImmutable|null */
    private $takenAt;

    /** @var float|null */
    private $gpsImgDirection;

    /** @var string|null */
    private $gpsLatitudeRef;

    /** @var string|null */
    private $gpsLongitudeRef;

    private $focalLengthIn35mmFilm;

    public function __construct(
        ?float $latitude,
        ?float $longitude,
        ?float $altitude,
        ?string $make,
        ?string $model,
        ?string $exposure,
        ?string $aperture,
        ?string $focalLength,
        ?string $ISO,
        ?float $gpsImgDirection,
        ?\DateTimeImmutable $takenAt,
        $focalLengthIn35mmFilm,
        ?string $gpsLatitudeRef,
        ?string $gpsLongitudeRef
    ) {
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->altitude = $altitude;
        $this->make = $make;
        $this->model = $model;
        $this->exposure = $exposure;
        $this->aperture = $aperture;
        $this->focalLength = $focalLength;
        $this->ISO = $ISO;
        $this->gpsImgDirection = $gpsImgDirection;
        $this->takenAt = $takenAt;
        $this->gpsLatitudeRef = $gpsLatitudeRef;
        $this->gpsLongitudeRef = $gpsLongitudeRef;
        $this->focalLengthIn35mmFilm = $focalLengthIn35mmFilm;

    }

    public function setLatitude(?float $latitude): void
    {
        $this->latitude = $latitude;
    }

    public function setLongitude(?float $longitude): void
    {
        $this->longitude = $longitude;
    }

    public function setTakenAt(?\DateTimeImmutable $takenAt): void
    {
        $this->takenAt = $takenAt;
    }
    public function setGpsImgDirection(?float $gpsImgDirection): void
    {
        $this->gpsImgDirection = $gpsImgDirection;
    }

    public function setGpsLatitudeRef(?string $gpsLatitudeRef): void
    {
        $this->gpsLatitudeRef = $gpsLatitudeRef;
    }
    public function setGpsLongitudeRef(?float $gpsLongitudeRef): void
    {
        $this->gpsLongitudeRef = $gpsLongitudeRef;
    }
    public function setFocalLengthIn35mmFilm( $focalLengthIn35mmFilm): void
    {
        $this->focalLengthIn35mmFilm = $focalLengthIn35mmFilm;
    }

    public function getLatitude(): ?float
    {
        return (float) $this->latitude;
    }

    public function getLongitude(): ?float
    {
        return (float) $this->longitude;
    }

    public function getAltitude(): ?float
    {
        return (float) $this->altitude;
    }

    public function getMake(): ?string
    {
        return $this->make;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function getTakenAt(): ?\DateTimeImmutable
    {
        return $this->takenAt;
    }

    public function getGpsImgDirection(): ?float
    {
        return (float) $this->gpsImgDirection;
    }

    public function getGpsLatitudeRef(): ?string
    {
       return (string) $this->gpsLatitudeRef;
    }

    public function getGpsLongitudeRef(): ?string
    {
       return (string) $this->gpsLongitudeRef;
    }

    public function getFocalLengthIn35mmFilm()
    {
        return $this->focalLengthIn35mmFilm;
    }

    public function getExposure(): ?string
    {
        return $this->exposure;
    }

    public function getAperture(): ?string
    {
        return $this->aperture;
    }

    public function getFocalLength(): ?string
    {
        return $this->focalLength;
    }

    public function getISO(): ?string
    {
        return $this->ISO;
    }

    public function hasGeoCoordinates(): bool
    {
        return !is_null($this->longitude) && !is_null($this->latitude);
    }
}
