<?php

namespace App\Repository;

use App\Entity\Registre;

interface RegistreRepositoryInterface
{
    public function findAll(): array;
    public function findById(int $id): ?Registre;
    public function findByKilasyId(int $kilasyId): array;
    public function findByDate(\DateTimeInterface $date): array;
    public function findByKilasyIdAndDate(int $kilasyId, \DateTimeInterface $date): ?Registre;
    public function save(Registre $registre): void;
    public function delete(Registre $registre): void;
}
