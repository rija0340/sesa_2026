<?php

namespace App\Tests\Entity;

use App\Domain\Exception\DomainValidationException;
use App\Entity\Kilasy;
use PHPUnit\Framework\TestCase;

class KilasyTest extends TestCase
{
    public function testApplyConfigurationSuccess(): void
    {
        $kilasy = new Kilasy();
        
        $kilasy->appliquerConfiguration(
            nom: 'Test Class',
            description: 'A description',
            nbrMambra: 10,
            nbrMambraUsed: Kilasy::NBR_MAMBRA_USED_CUSTOM,
            kilasyLasitra: null
        );

        $this->assertEquals('Test Class', $kilasy->getNom());
        $this->assertEquals('A description', $kilasy->getDescription());
        $this->assertEquals(10, $kilasy->getNbrMambra());
        $this->assertEquals(Kilasy::NBR_MAMBRA_USED_CUSTOM, $kilasy->getNbrMambraUsed());
    }

    public function testApplyConfigurationRequiresNom(): void
    {
        $kilasy = new Kilasy();

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le nom de la classe est obligatoire.');

        $kilasy->appliquerConfiguration(
            nom: '   ',
            description: null,
            nbrMambra: null,
            nbrMambraUsed: Kilasy::NBR_MAMBRA_USED_REGISTRE,
            kilasyLasitra: null
        );
    }

    public function testApplyConfigurationRequiresNbrMambraWhenCustom(): void
    {
        $kilasy = new Kilasy();

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le nombre de membres est requis quand la stratégie est "custom".');

        $kilasy->appliquerConfiguration(
            nom: 'Test',
            description: null,
            nbrMambra: null,
            nbrMambraUsed: Kilasy::NBR_MAMBRA_USED_CUSTOM,
            kilasyLasitra: null
        );
    }

    public function testApplyConfigurationRejectsNegativeNbrMambra(): void
    {
        $kilasy = new Kilasy();

        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage('Le nombre de membres ne peut pas être négatif.');

        $kilasy->appliquerConfiguration(
            nom: 'Test',
            description: null,
            nbrMambra: -5,
            nbrMambraUsed: Kilasy::NBR_MAMBRA_USED_CUSTOM,
            kilasyLasitra: null
        );
    }

    public function testGetNombreMembresEffectif(): void
    {
        $kilasy = new Kilasy();
        
        // Case 1: Custom strategy
        $kilasy->setNbrMambraUsed(Kilasy::NBR_MAMBRA_USED_CUSTOM);
        $kilasy->setNbrMambra(15);
        $this->assertEquals(15, $kilasy->getNombreMembresEffectif());

        // Case 2: Registre strategy
        $kilasy->setNbrMambraUsed(Kilasy::NBR_MAMBRA_USED_REGISTRE);
        $kilasy->setNbrMambra(15);
        $this->assertEquals(15, $kilasy->getNombreMembresEffectif());
    }
}
