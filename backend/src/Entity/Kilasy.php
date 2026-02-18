<?php

namespace App\Entity;

use App\Domain\Exception\DomainValidationException;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class Kilasy
{
    const NBR_MAMBRA_USED_REGISTRE = 'registre';
    const NBR_MAMBRA_USED_CUSTOM = 'custom';
    const NBR_MAMBRA_USED_VALUES = [
        self::NBR_MAMBRA_USED_REGISTRE,
        self::NBR_MAMBRA_USED_CUSTOM,
    ];

    private ?int $id = null;
    private string $nom;
    private ?string $description = null;
    private ?int $nbrMambra = null;
    private string $nbrMambraUsed = self::NBR_MAMBRA_USED_REGISTRE;

    private ?KilasyLasitra $kilasyLasitra = null;
    private Collection $registres;

    public function __construct()
    {
        $this->registres = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getNbrMambra(): ?int
    {
        return $this->nbrMambra;
    }

    public function setNbrMambra(?int $nbrMambra): self
    {
        $this->nbrMambra = $nbrMambra;
        return $this;
    }

    public function getNbrMambraUsed(): string
    {
        return $this->nbrMambraUsed;
    }

    public function setNbrMambraUsed(string $nbrMambraUsed): self
    {
        $this->nbrMambraUsed = $nbrMambraUsed;
        return $this;
    }

    public function getKilasyLasitra(): ?KilasyLasitra
    {
        return $this->kilasyLasitra;
    }

    public function setKilasyLasitra(?KilasyLasitra $kilasyLasitra): self
    {
        $this->kilasyLasitra = $kilasyLasitra;
        return $this;
    }

    public function appliquerConfiguration(
        string $nom,
        ?string $description,
        ?int $nbrMambra,
        string $nbrMambraUsed,
        ?KilasyLasitra $kilasyLasitra
    ): self {
        $nom = trim($nom);

        if ($nom === '') {
            throw new DomainValidationException('Le nom de la classe est obligatoire.');
        }

        if (!in_array($nbrMambraUsed, self::NBR_MAMBRA_USED_VALUES, true)) {
            throw new DomainValidationException('La stratégie de nombre de membres est invalide.');
        }

        if ($nbrMambra !== null && $nbrMambra < 0) {
            throw new DomainValidationException('Le nombre de membres ne peut pas être négatif.');
        }

        if ($nbrMambraUsed === self::NBR_MAMBRA_USED_CUSTOM && $nbrMambra === null) {
            throw new DomainValidationException('Le nombre de membres est requis quand la stratégie est "custom".');
        }

        $this->nom = $nom;
        $this->description = $description;
        $this->nbrMambra = $nbrMambra;
        $this->nbrMambraUsed = $nbrMambraUsed;
        $this->kilasyLasitra = $kilasyLasitra;

        return $this;
    }

    public function getRegistres(): Collection
    {
        return $this->registres;
    }

    public function addRegistre(Registre $registre): self
    {
        if (!$this->registres->contains($registre)) {
            $this->registres->add($registre);
            $registre->setKilasy($this);
        }

        return $this;
    }

    public function removeRegistre(Registre $registre): self
    {
        if ($this->registres->removeElement($registre)) {
            if ($registre->getKilasy() === $this) {
                $registre->setKilasy(null);
            }
        }

        return $this;
    }

    /**
     * Obtenir le nombre effectif de membres dans la classe
     */
    public function getNombreMembresEffectif(): int
    {
        if ($this->nbrMambraUsed === self::NBR_MAMBRA_USED_CUSTOM && $this->nbrMambra !== null) {
            return $this->nbrMambra;
        }
        
        return $this->nbrMambra ?? 0;
    }

    /**
     * Obtenir les statistiques de la classe
     */
    public function getStatistiques(): array
    {
        $registres = $this->registres;
        $totalRegistres = count($registres);
        
        $presencesTotales = 0;
        $apprentissagesTotaux = 0;
        
        foreach ($registres as $registre) {
            $presencesTotales += $registre->getPourcentagePresence();
            $apprentissagesTotaux += $registre->getPourcentageApprentissage();
        }
        
        $tauxMoyenPresence = $totalRegistres > 0 ? $presencesTotales / $totalRegistres : 0;
        $tauxMoyenApprentissage = $totalRegistres > 0 ? $apprentissagesTotaux / $totalRegistres : 0;

        return [
            'totalRegistres' => $totalRegistres,
            'tauxMoyenPresence' => round($tauxMoyenPresence, 2),
            'tauxMoyenApprentissage' => round($tauxMoyenApprentissage, 2),
        ];
    }
}
