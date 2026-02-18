<?php

namespace App\Entity;

use App\Domain\Exception\DomainValidationException;
use DateTime;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class Registre
{
    private ?int $id = null;
    private int $mambraTonga;
    private int $mpamangy;
    private int $nianatraImpito;
    private int $asaSoa;
    private int $fampianaranaBaiboly;
    private int $bokyTrakta;
    private int $semineraKaoferansa;
    private int $alasarona;
    private int $nahavitaFampTaratasy;
    private int $batisaTami;
    private float $fanatitra;
    private DateTimeInterface $createdAt;
    private int $tongaRehetra;
    private int $asafi;
    private ?int $nbrMambraKilasy = null;

    private ?Kilasy $kilasy = null;
    private Collection $fianaranaLesonas;

    public function __construct()
    {
        $this->fianaranaLesonas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMambraTonga(): int
    {
        return $this->mambraTonga;
    }

    public function setMambraTonga(int $mambraTonga): self
    {
        $this->mambraTonga = $mambraTonga;
        return $this;
    }

    public function getMpamangy(): int
    {
        return $this->mpamangy;
    }

    public function setMpamangy(int $mpamangy): self
    {
        $this->mpamangy = $mpamangy;
        return $this;
    }

    public function getNianatraImpito(): int
    {
        return $this->nianatraImpito;
    }

    public function setNianatraImpito(int $nianatraImpito): self
    {
        $this->nianatraImpito = $nianatraImpito;
        return $this;
    }

    public function getAsaSoa(): int
    {
        return $this->asaSoa;
    }

    public function setAsaSoa(int $asaSoa): self
    {
        $this->asaSoa = $asaSoa;
        return $this;
    }

    public function getFampianaranaBaiboly(): int
    {
        return $this->fampianaranaBaiboly;
    }

    public function setFampianaranaBaiboly(int $fampianaranaBaiboly): self
    {
        $this->fampianaranaBaiboly = $fampianaranaBaiboly;
        return $this;
    }

    public function getBokyTrakta(): int
    {
        return $this->bokyTrakta;
    }

    public function setBokyTrakta(int $bokyTrakta): self
    {
        $this->bokyTrakta = $bokyTrakta;
        return $this;
    }

    public function getSemineraKaoferansa(): int
    {
        return $this->semineraKaoferansa;
    }

    public function setSemineraKaoferansa(int $semineraKaoferansa): self
    {
        $this->semineraKaoferansa = $semineraKaoferansa;
        return $this;
    }

    public function getAlasarona(): int
    {
        return $this->alasarona;
    }

    public function setAlasarona(int $alasarona): self
    {
        $this->alasarona = $alasarona;
        return $this;
    }

    public function getNahavitaFampTaratasy(): int
    {
        return $this->nahavitaFampTaratasy;
    }

    public function setNahavitaFampTaratasy(int $nahavitaFampTaratasy): self
    {
        $this->nahavitaFampTaratasy = $nahavitaFampTaratasy;
        return $this;
    }

    public function getBatisaTami(): int
    {
        return $this->batisaTami;
    }

    public function setBatisaTami(int $batisaTami): self
    {
        $this->batisaTami = $batisaTami;
        return $this;
    }

    public function getFanatitra(): float
    {
        return $this->fanatitra;
    }

    public function setFanatitra(float $fanatitra): self
    {
        $this->fanatitra = $fanatitra;
        return $this;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getKilasy(): ?Kilasy
    {
        return $this->kilasy;
    }

    public function setKilasy(?Kilasy $kilasy): self
    {
        $this->kilasy = $kilasy;
        return $this;
    }

    public function getTongaRehetra(): int
    {
        return $this->tongaRehetra;
    }

    public function setTongaRehetra(int $tongaRehetra): self
    {
        $this->tongaRehetra = $tongaRehetra;
        return $this;
    }

    public function getAsafi(): int
    {
        return $this->asafi;
    }

    public function setAsafi(int $asafi): self
    {
        $this->asafi = $asafi;
        return $this;
    }

    public function getNbrMambraKilasy(): ?int
    {
        return $this->nbrMambraKilasy;
    }

    public function setNbrMambraKilasy(?int $nbrMambraKilasy): self
    {
        $this->nbrMambraKilasy = $nbrMambraKilasy;
        return $this;
    }

    public function enregistrerDonnees(
        Kilasy $kilasy,
        int $mambraTonga,
        int $mpamangy,
        int $nianatraImpito,
        int $asaSoa,
        int $fampianaranaBaiboly,
        int $bokyTrakta,
        int $semineraKaoferansa,
        int $alasarona,
        int $nahavitaFampTaratasy,
        int $batisaTami,
        float $fanatitra,
        DateTimeInterface $createdAt,
        int $tongaRehetra,
        int $asafi,
        ?int $nbrMambraKilasy
    ): self {
        $this->assertPositiveOrZero('mambraTonga', $mambraTonga);
        $this->assertPositiveOrZero('mpamangy', $mpamangy);
        $this->assertPositiveOrZero('nianatraImpito', $nianatraImpito);
        $this->assertPositiveOrZero('asaSoa', $asaSoa);
        $this->assertPositiveOrZero('fampianaranaBaiboly', $fampianaranaBaiboly);
        $this->assertPositiveOrZero('bokyTrakta', $bokyTrakta);
        $this->assertPositiveOrZero('semineraKaoferansa', $semineraKaoferansa);
        $this->assertPositiveOrZero('alasarona', $alasarona);
        $this->assertPositiveOrZero('nahavitaFampTaratasy', $nahavitaFampTaratasy);
        $this->assertPositiveOrZero('batisaTami', $batisaTami);
        $this->assertPositiveOrZero('tongaRehetra', $tongaRehetra);
        $this->assertPositiveOrZero('asafi', $asafi);

        if ($fanatitra < 0) {
            throw new DomainValidationException('Le fanatitra ne peut pas être négatif.');
        }

        if ($nbrMambraKilasy !== null && $nbrMambraKilasy < 0) {
            throw new DomainValidationException('Le nombre de membres de la classe ne peut pas être négatif.');
        }

        $totalMembres = $kilasy->getNombreMembresEffectif();

        if ($mambraTonga > $totalMembres) {
            throw new DomainValidationException('Le nombre de membres présents est supérieur au nombre total de membres dans la classe.');
        }

        if ($nianatraImpito > $totalMembres) {
            throw new DomainValidationException('Le nombre d\'apprenants est supérieur au nombre total de membres dans la classe.');
        }

        if ($nianatraImpito > $tongaRehetra) {
            throw new DomainValidationException('Le nombre d\'apprenants est supérieur au nombre total de personnes présentes.');
        }

        $this->kilasy = $kilasy;
        $this->mambraTonga = $mambraTonga;
        $this->mpamangy = $mpamangy;
        $this->nianatraImpito = $nianatraImpito;
        $this->asaSoa = $asaSoa;
        $this->fampianaranaBaiboly = $fampianaranaBaiboly;
        $this->bokyTrakta = $bokyTrakta;
        $this->semineraKaoferansa = $semineraKaoferansa;
        $this->alasarona = $alasarona;
        $this->nahavitaFampTaratasy = $nahavitaFampTaratasy;
        $this->batisaTami = $batisaTami;
        $this->fanatitra = $fanatitra;
        $this->createdAt = $this->normalizeDate($createdAt);
        $this->tongaRehetra = $tongaRehetra;
        $this->asafi = $asafi;
        $this->nbrMambraKilasy = $nbrMambraKilasy;

        return $this;
    }

    /**
     * Calculer le pourcentage de présence
     */
    public function getPourcentagePresence(): float
    {
        $totalMembres = $this->kilasy ? $this->kilasy->getNombreMembresEffectif() : 0;
        if ($totalMembres === 0) {
            return 0.0;
        }
        
        return round(($this->mambraTonga * 100) / $totalMembres, 2);
    }

    /**
     * Calculer le pourcentage d'apprentissage
     */
    public function getPourcentageApprentissage(): float
    {
        if ($this->tongaRehetra === 0) {
            return 0.0;
        }
        
        return round(($this->nianatraImpito * 100) / $this->tongaRehetra, 2);
    }

    /**
     * Valider les données du registre
     */
    public function validate(): array
    {
        $erreurs = [];
        
        $totalMembres = $this->kilasy ? $this->kilasy->getNombreMembresEffectif() : 0;
        
        if ($this->mambraTonga > $totalMembres) {
            $erreurs[] = "Le nombre de membres présents est supérieur au nombre total de membres dans la classe";
        }

        if ($this->nianatraImpito > $totalMembres) {
            $erreurs[] = "Le nombre d'apprenants est supérieur au nombre total de membres dans la classe";
        }

        if ($this->nianatraImpito > $this->tongaRehetra) {
            $erreurs[] = "Le nombre d'apprenants est supérieur au nombre total de personnes présentes";
        }

        return $erreurs;
    }

    private function assertPositiveOrZero(string $field, int $value): void
    {
        if ($value < 0) {
            throw new DomainValidationException(sprintf('La valeur "%s" ne peut pas être négative.', $field));
        }
    }

    private function normalizeDate(DateTimeInterface $date): DateTimeInterface
    {
        if ($date instanceof DateTimeImmutable) {
            $mutableDate = new DateTime();
            $mutableDate->setTimestamp($date->getTimestamp());

            return $mutableDate;
        }

        return $date;
    }
}
