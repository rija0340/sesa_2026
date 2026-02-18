<?php

namespace App\Tests\Entity;

use App\Domain\Exception\DomainValidationException;
use App\Entity\Kilasy;
use App\Entity\Registre;
use DateTime;
use PHPUnit\Framework\TestCase;

class RegistreTest extends TestCase
{
    private function createKilasy(int $nbrMambra): Kilasy
    {
        $kilasy = new Kilasy();
        $kilasy->setNom('Classe Test');
        $kilasy->setNbrMambraUsed(Kilasy::NBR_MAMBRA_USED_CUSTOM);
        $kilasy->setNbrMambra($nbrMambra);
        return $kilasy;
    }

    public function testEnregistrerDonneesSuccess(): void
    {
        $registre = new Registre();
        $kilasy = $this->createKilasy(10);
        $now = new DateTime();

        $registre->enregistrerDonnees(
            kilasy: $kilasy,
            mambraTonga: 8,
            mpamangy: 2,
            nianatraImpito: 5,
            asaSoa: 1,
            fampianaranaBaiboly: 1,
            bokyTrakta: 1,
            semineraKaoferansa: 0,
            alasarona: 0,
            nahavitaFampTaratasy: 0,
            batisaTami: 0,
            fanatitra: 150.50,
            createdAt: $now,
            tongaRehetra: 10,
            asafi: 0,
            nbrMambraKilasy: null
        );

        $this->assertSame($kilasy, $registre->getKilasy());
        $this->assertEquals(8, $registre->getMambraTonga());
        $this->assertEquals(150.50, $registre->getFanatitra());
        // Verify percentages
        $this->assertEquals(80.0, $registre->getPourcentagePresence()); // 8 / 10 * 100
        $this->assertEquals(50.0, $registre->getPourcentageApprentissage()); // 5 / 10 * 100
    }

    public function testEnregistrerDonneesRejectsMoreTongaThanMambra(): void
    {
        $registre = new Registre();
        $kilasy = $this->createKilasy(10);

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le nombre de membres présents est supérieur au nombre total de membres dans la classe.');

        $registre->enregistrerDonnees(
            kilasy: $kilasy,
            mambraTonga: 11, // Too many
            mpamangy: 0,
            nianatraImpito: 0,
            asaSoa: 0,
            fampianaranaBaiboly: 0,
            bokyTrakta: 0,
            semineraKaoferansa: 0,
            alasarona: 0,
            nahavitaFampTaratasy: 0,
            batisaTami: 0,
            fanatitra: 0,
            createdAt: new DateTime(),
            tongaRehetra: 11,
            asafi: 0,
            nbrMambraKilasy: null
        );
    }

    public function testEnregistrerDonneesRejectsMoreApprenantsThanTonga(): void
    {
        $registre = new Registre();
        $kilasy = $this->createKilasy(10);

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le nombre d\'apprenants est supérieur au nombre total de personnes présentes.');

        $registre->enregistrerDonnees(
            kilasy: $kilasy,
            mambraTonga: 5,
            mpamangy: 0,
            nianatraImpito: 6, // 6 apprenants > 5 présents
            asaSoa: 0,
            fampianaranaBaiboly: 0,
            bokyTrakta: 0,
            semineraKaoferansa: 0,
            alasarona: 0,
            nahavitaFampTaratasy: 0,
            batisaTami: 0,
            fanatitra: 0,
            createdAt: new DateTime(),
            tongaRehetra: 5,
            asafi: 0,
            nbrMambraKilasy: null
        );
    }

    public function testEnregistrerDonneesRejectsNegativeFanatitra(): void
    {
        $registre = new Registre();
        $kilasy = $this->createKilasy(10);

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le fanatitra ne peut pas être négatif.');

        $registre->enregistrerDonnees(
            kilasy: $kilasy,
            mambraTonga: 5,
            mpamangy: 0,
            nianatraImpito: 5,
            asaSoa: 0,
            fampianaranaBaiboly: 0,
            bokyTrakta: 0,
            semineraKaoferansa: 0,
            alasarona: 0,
            nahavitaFampTaratasy: 0,
            batisaTami: 0,
            fanatitra: -1, // Negative
            createdAt: new DateTime(),
            tongaRehetra: 5,
            asafi: 0,
            nbrMambraKilasy: null
        );
    }
}
