<?php

namespace App\Controller\Admin;

use App\Domain\Entity\Image;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ImageCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Image::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields(['id', 'filename', 'resizedFilename', 'thumbnailFilename', 'description', 'longDescription', 'exifData.latitude', 'exifData.longitude', 'exifData.altitude', 'exifData.make', 'exifData.model', 'exifData.exposure', 'exifData.aperture', 'exifData.focalLength', 'exifData.ISO', 'weather.description', 'weather.temperature', 'weather.humidity', 'weather.pressure', 'weather.windSpeed'])
            ->setPaginatorPageSize(30);
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->disable('new');
    }

    public function configureFields(string $pageName): iterable
    {
        $filename = TextField::new('filename');
        $resizedFilename = TextField::new('resizedFilename');
        $thumbnailFilename = ImageField::new('thumbnailFilename');
        $description = TextField::new('description');
        $longDescription = TextareaField::new('longDescription');
        $createdAt = DateTimeField::new('createdAt');

        $exifDataLatitude = NumberField::new('exifData.latitude', 'Latitude');
        $exifDataLongitude = NumberField::new('exifData.longitude', 'Longitude');
        $exifDataAltitude = NumberField::new('exifData.altitude', 'Altitude');
        $exifDataMake = TextField::new('exifData.make', 'Make');
        $exifDataModel = TextField::new('exifData.model', 'Model');
        $exifDataExposure = TextField::new('exifData.exposure', 'Exposure');
        $exifDataAperture = TextField::new('exifData.aperture', 'Aperture');
        $exifDataFocalLength = TextField::new('exifData.focalLength', 'Focal Length');
        $exifDataISO = TextField::new('exifData.ISO', 'ISO');
        $exifDataTakenAt = DateTimeField::new('exifData.takenAt', 'Taken At');
        $exifDataGpsImgDirection = NumberField::new('exifData.gpsImgDirection', 'GPS Image Direction');
        $exifDataGpsLatitudeRef = TextField::new('exifData.gpsLatitudeRef', 'GPS Latitude Ref');
        $exifDataGpsLongitudeRef = TextField::new('exifData.gpsLongitudeRef', 'GPS Longitude Ref');
        $focalLengthIn35mmFilm = TextField::new('exifData.focalLengthIn35mmFilm', 'Focal Length in 35mm Film');

        $weatherDescription = TextField::new('weather.description');
        $weatherTemperature = NumberField::new('weather.temperature', 'Temperature');
        $weatherHumidity = NumberField::new('weather.humidity', 'Humidity');
        $weatherPressure = NumberField::new('weather.pressure', 'Pressure');
        $weatherWindSpeed = NumberField::new('weather.windSpeed', 'Wind speed');

        $gallery = AssociationField::new('gallery');
        $id = TextField::new('id', 'ID');

        $galleryName = TextareaField::new('galleryName');

        if (Crud::PAGE_INDEX === $pageName) {
            return [
                $thumbnailFilename,
                $filename,
                $description,
                $longDescription,
                $galleryName,
                $createdAt
            ];
        } elseif (Crud::PAGE_DETAIL === $pageName) {
            return [
                $id,
                $filename,
                $resizedFilename,
                $thumbnailFilename,
                $description,
                $longDescription,
                $createdAt,
                $exifDataLatitude,
                $exifDataLongitude,
                $exifDataAltitude,
                $exifDataMake,
                $exifDataModel,
                $exifDataExposure,
                $exifDataAperture,
                $exifDataFocalLength,
                $exifDataISO,
                $exifDataTakenAt,
                $weatherDescription,
                $weatherTemperature,
                $weatherHumidity,
                $weatherPressure,
                $weatherWindSpeed,
                $gallery
            ];
        } elseif (Crud::PAGE_NEW === $pageName) {
            return [
                $filename,
                $resizedFilename,
                $thumbnailFilename,
                $description,
                $longDescription,
                $createdAt,
                $exifDataLatitude,
                $exifDataLongitude,
                $exifDataAltitude,
                $exifDataMake,
                $exifDataModel,
                $exifDataExposure,
                $exifDataAperture,
                $exifDataFocalLength,
                $exifDataISO,
                $exifDataTakenAt,
                $weatherDescription,
                $weatherTemperature,
                $weatherHumidity,
                $weatherPressure,
                $weatherWindSpeed,
                $gallery
            ];
        } elseif (Crud::PAGE_EDIT === $pageName) {
            return [
                $description->setColumns('col-md-12'),
                $longDescription->setColumns('col-md-12'),

                FormField::addPanel('Weather'),
                $weatherTemperature->setColumns('col-md-4'),
                $weatherHumidity->setColumns('col-md-4'),
                $weatherPressure->setColumns('col-md-4'),
                $weatherWindSpeed->setColumns('col-md-4'),

                FormField::addPanel('Exif Data'),
                $exifDataLatitude->setColumns('col-md-4'),
                $exifDataLongitude->setColumns('col-md-4'),
                $exifDataTakenAt->setColumns('col-md-4'),
                $exifDataGpsImgDirection->setColumns('col-md-4'),
                $exifDataGpsLatitudeRef->setColumns('col-md-4'),
                $exifDataGpsLongitudeRef->setColumns('col-md-4'),
                $focalLengthIn35mmFilm->setColumns('col-md-4'),
                $exifDataLatitude->setColumns('col-md-4'),
                $exifDataLongitude->setColumns('col-md-4'),
                $exifDataAperture->setColumns('col-md-4'),
                $exifDataFocalLength->setColumns('col-md-4'),
                $exifDataISO->setColumns('col-md-4'),
            ];
        }
    }
}
