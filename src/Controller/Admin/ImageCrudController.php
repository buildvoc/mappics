<?php

namespace App\Controller\Admin;

use App\Domain\Entity\Image;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
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
        $longDescription = TextField::new('longDescription');
        $createdAt = DateTimeField::new('createdAt');
        $exifDataLatitude = NumberField::new('exifData.latitude');
        $exifDataLongitude = NumberField::new('exifData.longitude');
        $exifDataAltitude = TextField::new('exifData.altitude');
        $exifDataMake = TextField::new('exifData.make');
        $exifDataModel = TextField::new('exifData.model');
        $exifDataExposure = TextField::new('exifData.exposure');
        $exifDataAperture = TextField::new('exifData.aperture');
        $exifDataFocalLength = TextField::new('exifData.focalLength');
        $exifDataISO = TextField::new('exifData.ISO');
        $exifDataTakenAt = DateTimeField::new('exifData.takenAt');
        $weatherDescription = TextField::new('weather.description');
        $weatherTemperature = TextField::new('weather.temperature');
        $weatherHumidity = TextField::new('weather.humidity');
        $weatherPressure = TextField::new('weather.pressure');
        $weatherWindSpeed = TextField::new('weather.windSpeed');
        $gallery = AssociationField::new('gallery');
        $id = TextField::new('id', 'ID');
        $galleryName = TextareaField::new('galleryName');

        if (Crud::PAGE_INDEX === $pageName) {
            return [$thumbnailFilename, $filename, $description, $longDescription, $galleryName, $createdAt];
        } elseif (Crud::PAGE_DETAIL === $pageName) {
            return [$id, $filename, $resizedFilename, $thumbnailFilename, $description, $longDescription, $createdAt, $exifDataLatitude, $exifDataLongitude, $exifDataAltitude, $exifDataMake, $exifDataModel, $exifDataExposure, $exifDataAperture, $exifDataFocalLength, $exifDataISO, $exifDataTakenAt, $weatherDescription, $weatherTemperature, $weatherHumidity, $weatherPressure, $weatherWindSpeed, $gallery];
        } elseif (Crud::PAGE_NEW === $pageName) {
            return [$filename, $resizedFilename, $thumbnailFilename, $description, $longDescription, $createdAt, $exifDataLatitude, $exifDataLongitude, $exifDataAltitude, $exifDataMake, $exifDataModel, $exifDataExposure, $exifDataAperture, $exifDataFocalLength, $exifDataISO, $exifDataTakenAt, $weatherDescription, $weatherTemperature, $weatherHumidity, $weatherPressure, $weatherWindSpeed, $gallery];
        } elseif (Crud::PAGE_EDIT === $pageName) {
            return [$description, $longDescription, $exifDataLatitude, $exifDataLongitude, $exifDataTakenAt];
        }
    }
}
