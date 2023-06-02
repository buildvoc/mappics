<?php

declare(strict_types=1);

namespace App\Infrastructure\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230520155607 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE gallery (id VARCHAR(255) NOT NULL, path VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id VARCHAR(255) NOT NULL, gallery_id VARCHAR(255) DEFAULT NULL, filename VARCHAR(255) NOT NULL, resized_filename VARCHAR(255) DEFAULT NULL, thumbnail_filename VARCHAR(255) DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, long_description VARCHAR(255) DEFAULT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, exif_data_latitude VARCHAR(255) DEFAULT NULL, exif_data_longitude VARCHAR(255) DEFAULT NULL, exif_data_altitude VARCHAR(255) DEFAULT NULL, exif_data_make VARCHAR(255) DEFAULT NULL, exif_data_model VARCHAR(255) DEFAULT NULL, exif_data_exposure VARCHAR(255) DEFAULT NULL, exif_data_aperture VARCHAR(255) DEFAULT NULL, exif_data_focal_length VARCHAR(255) DEFAULT NULL, exif_data_iso VARCHAR(255) DEFAULT NULL, exif_data_taken_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', exif_data_gps_img_direction VARCHAR(255) DEFAULT NULL, weather_description VARCHAR(255) DEFAULT NULL, weather_temperature VARCHAR(255) DEFAULT NULL, weather_humidity VARCHAR(255) DEFAULT NULL, weather_pressure VARCHAR(255) DEFAULT NULL, weather_wind_speed VARCHAR(255) DEFAULT NULL, INDEX IDX_C53D045F4E7AF8F (gallery_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F4E7AF8F FOREIGN KEY (gallery_id) REFERENCES gallery (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F4E7AF8F');
        $this->addSql('DROP TABLE gallery');
        $this->addSql('DROP TABLE image');
    }
}
