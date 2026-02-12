<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class KilasyLasitra
{
    private ?int $id = null;
    private string $nom;
    private string $trancheAge;
    private ?string $description = null;

    private Collection $kilasies;

    public function __construct()
    {
        $this->kilasies = new ArrayCollection();
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

    public function getTrancheAge(): string
    {
        return $this->trancheAge;
    }

    public function setTrancheAge(string $trancheAge): self
    {
        $this->trancheAge = $trancheAge;
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

    public function getKilasies(): Collection
    {
        return $this->kilasies;
    }

    public function addKilasy(Kilasy $kilasy): self
    {
        if (!$this->kilasies->contains($kilasy)) {
            $this->kilasies->add($kilasy);
            $kilasy->setKilasyLasitra($this);
        }

        return $this;
    }

    public function removeKilasy(Kilasy $kilasy): self
    {
        if ($this->kilasies->removeElement($kilasy)) {
            if ($kilasy->getKilasyLasitra() === $this) {
                $kilasy->setKilasyLasitra(null);
            }
        }

        return $this;
    }
}