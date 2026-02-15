<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260215163909 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE kilasy (nom VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, nbr_mambra INT DEFAULT NULL, nbr_mambra_used VARCHAR(255) NOT NULL, id INT AUTO_INCREMENT NOT NULL, kilasy_lasitra_id INT DEFAULT NULL, INDEX IDX_52FD41071D31AF05 (kilasy_lasitra_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE kilasy_lasitra (nom VARCHAR(255) NOT NULL, tranche_age VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE registre (mambra_tonga INT NOT NULL, mpamangy INT NOT NULL, nianatra_impito INT NOT NULL, asa_soa INT NOT NULL, fampianarana_baiboly INT NOT NULL, boky_trakta INT NOT NULL, seminera_kaoferansa INT NOT NULL, alasarona INT NOT NULL, nahavita_famp_taratasy INT NOT NULL, batisa_tami INT NOT NULL, fanatitra DOUBLE PRECISION NOT NULL, created_at DATE NOT NULL, tonga_rehetra INT DEFAULT NULL, asafi INT NOT NULL, nbr_mambra_kilasy INT DEFAULT NULL, id INT AUTO_INCREMENT NOT NULL, kilasy_id INT NOT NULL, INDEX IDX_D9A9414549602302 (kilasy_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE kilasy ADD CONSTRAINT FK_52FD41071D31AF05 FOREIGN KEY (kilasy_lasitra_id) REFERENCES kilasy_lasitra (id)');
        $this->addSql('ALTER TABLE registre ADD CONSTRAINT FK_D9A9414549602302 FOREIGN KEY (kilasy_id) REFERENCES kilasy (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE kilasy DROP FOREIGN KEY FK_52FD41071D31AF05');
        $this->addSql('ALTER TABLE registre DROP FOREIGN KEY FK_D9A9414549602302');
        $this->addSql('DROP TABLE kilasy');
        $this->addSql('DROP TABLE kilasy_lasitra');
        $this->addSql('DROP TABLE registre');
    }
}
