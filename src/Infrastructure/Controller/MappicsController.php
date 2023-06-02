<?php
declare(strict_types = 1);

namespace App\Infrastructure\Controller;

use App\Application\Service\ExifReader;
use App\Domain\Entity\FileInfo;
use App\Domain\Entity\Gallery;
use App\Domain\Entity\Image;
use App\Domain\Repository\GalleryRepository;
use App\Domain\Repository\ImageRepository;
use Symfony\Component\HttpFoundation\Response;
use Twig_Environment;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;


class MappicsController
{

    /** @var GalleryRepository */
    private $galleryRepository;

    /** @var ImageRepository */
    private $imageRepository;

    /** @var Twig_Environment */
    private $templating;

    /** @var string */
    private $mapboxApiKey;

    public function __construct(
        GalleryRepository $galleryRepository,
        ImageRepository $imageRepository,
        Twig_Environment $templating,
        string $mapboxApiKey,
        string $geojsonPath,
        string $geojson3dPath,
        ExifReader $exifReader
    ) {
        $this->galleryRepository = $galleryRepository;
        $this->imageRepository = $imageRepository;
        $this->templating = $templating;
        $this->mapboxApiKey = $mapboxApiKey;
        $this->geojsonPath = $geojsonPath;
        $this->geojson3dPath = $geojson3dPath;
        $this->exifReader = $exifReader;
    }

    public function _galleries(): Response
    {
        /** @var Gallery[] $galleries */
        $galleries = $this->galleryRepository->findAll();

        $dataArray = [];
        foreach ($galleries as $gallery) {
            $geoCoordinates = $gallery->getImagesMeanCoordinates();
            $dataArray[] = [
                $geoCoordinates->latitude,
                $geoCoordinates->longitude,
                $this->templating->render('popups/gallery.html.twig', [ 'gallery' => $gallery ])
            ];
        }

        $responseBody = $this->templating->render(
            'mappics/galleries.html.twig',
            [
                'galleries' => $galleries,
                'dataArray' => $dataArray,
                'mapboxApiKey' => $this->mapboxApiKey
            ]
        );

        return new Response($responseBody);
    }

    public function galleries(): Response
    {
        /** @var Gallery[] $galleries */
        $galleries = $this->galleryRepository->findAll();

        $dataArray = [];
        foreach ($galleries as $gallery) {
            $images = $gallery->getImages();
            foreach ($images as $image) {
                if ($image->hasExifGeoCoordinates()) {
                    $dataArray[] = [
                        $image->getExifData()->getLatitude(),
                        $image->getExifData()->getLongitude(),
                        $image->getThumbnailFilename(),
                        $this->templating->render('popups/image.html.twig', [ 'image' => $image ]),
                        $image->getExifData()->getGpsImgDirection(),
                        $image->getExifData()->getAltitude(),
                        $image->getExifData()->getGpsLatitudeRef(),
                        $image->getExifData()->getGpsLongitudeRef(),
                        $image->getExifData()->getFocalLengthIn35mmFilm(),
                        $image->getExifData()->getFocalLength(),
                    ];

                }
            }
        }



        $finder = Finder::create();

        $finder
            ->in($this->geojsonPath)
            ->depth(0)
            ->filter(static function (SplFileInfo $file) {
                return $file->isDir() || \preg_match('/\.(geojson)$/', $file->getPathname());
            });

        $filescontentarray = [];
        foreach ($finder->files() as $file) {
            $filescontentarray[] = $file->getContents();

        }

        $finder = Finder::create();

        $finder->in($this->geojsonPath)
            ->depth(0)
            ->filter(static function (SplFileInfo $file) {
                return $file->isDir() || \preg_match('/\.(jpg|JPG|png|jpeg|JPEG|PNG|GIF|gif)$/', $file->getPathname());
            });
        $imgcontentarray = [];
        foreach ($finder->files() as $imageFile) {
            $exif = @exif_read_data($this->geojsonPath . '/' . $imageFile->getFilename(), null, true);
            $imgcontentarray[] = $exif;
        }

        $geojson3dFile = new SplFileInfo($this->geojson3dPath . "/edited3Dbuildings.geojson", '', '');
        $buildings = $geojson3dFile->getContents();

        $responseBody = $this->templating->render(
            'mappics/galleries.html.twig',
            [
                'galleries' => $galleries,
                'dataArray' => $dataArray,
                'mapboxApiKey' => $this->mapboxApiKey,
                'buildings' => $buildings,
                'filescontentarray' => json_encode($filescontentarray),
                'imgcontentarray' => json_encode($imgcontentarray),
            ]
        );

        return new Response($responseBody);
    }

    public function gallery(string $gallerySlug): Response
    {
        $gallery = $this->galleryRepository->findBySlug($gallerySlug);
        /** @var Image[] $images */
        $images = $gallery->getImages();

        $dataArray = [];
        foreach ($images as $image) {
            if ($image->hasExifGeoCoordinates()) {
                $dataArray[] = [
                    $image->getExifData()->getLatitude(),
                    $image->getExifData()->getLongitude(),
                    $image->getThumbnailFilename(),
                    $this->templating->render('popups/image.html.twig', [ 'image' => $image ])
                ];
            }
        }

        $responseBody = $this->templating->render(
            'mappics/gallery.html.twig',
            [
                'galleries' => $this->galleryRepository->findAll(),
                'gallery' => $gallery,
                'dataArray' => $dataArray,
                'mapboxApiKey' => $this->mapboxApiKey
            ]
        );

        return new Response($responseBody);
    }

    public function worldmap(): Response
    {
        /** @var Gallery[] $galleries */
        $galleries = $this->galleryRepository->findAll();

        $dataArray = [];
        foreach ($galleries as $gallery) {
            $images = $gallery->getImages();
            foreach ($images as $image) {
                if ($image->hasExifGeoCoordinates()) {
                    $dataArray[] = [
                        $image->getExifData()->getLatitude(),
                        $image->getExifData()->getLongitude(),
                        $image->getThumbnailFilename(),
                        $this->templating->render('popups/image.html.twig', [ 'image' => $image ])
                    ];
                }
            }
        }



        $finder = Finder::create();

        $finder
            ->in($this->geojsonPath)
            ->depth(0)
            ->filter(static function (SplFileInfo $file) {
                return $file->isDir() || \preg_match('/\.(geojson)$/', $file->getPathname());
            });

        $filescontentarray = [];
        foreach ($finder->files() as $file) {
            $filescontentarray[] = $file->getContents();

        }

        $finder = Finder::create();

        $finder->in($this->geojsonPath)
        ->depth(0)
        ->filter(static function (SplFileInfo $file) {
            return $file->isDir() || \preg_match('/\.(jpg|JPG|png|jpeg|JPEG|PNG|GIF|gif)$/', $file->getPathname());
        });
        $imgcontentarray = [];
        foreach ($finder->files() as $imageFile) {
            $exif = @exif_read_data($this->geojsonPath . '/' . $imageFile->getFilename(), null, true);
            $imgcontentarray[] = $exif;

        }

        $geojson3dFile = new SplFileInfo($this->geojson3dPath . "/edited3Dbuildings.geojson", '', '');
        $buildings = $geojson3dFile->getContents();

        $responseBody = $this->templating->render(
            'mappics/worldmap.html.twig',
            [
                'galleries' => $galleries,
                'dataArray' => $dataArray,
                'mapboxApiKey' => $this->mapboxApiKey,
                'buildings' => $buildings,
                'filescontentarray' => json_encode($filescontentarray),
                'imgcontentarray' => json_encode($imgcontentarray),
            ]
        );

        return new Response($responseBody);
    }

    public function imageModal(string $imageId): Response
    {
        $image = $this->imageRepository->findById($imageId);
        $responseBody = $this->templating->render('modal/image.html.twig', [ 'image' => $image, 'mapboxApiKey' => $this->mapboxApiKey ]);

        return new Response($responseBody, 200);
    }

    public function about(): Response
    {
        /** @var Gallery[] $galleries */
        $galleries = $this->galleryRepository->findAll();
        $responseBody = $this->templating->render('mappics/about.html.twig', ['galleries' => $galleries]);

        return new Response($responseBody, 200);
    }
}
