<?php

namespace App\Repository;

use App\Entity\KilasyLasitra;

interface KilasyLasitraRepositoryInterface
{
    public function findAll(): array;
    public function findById(int $id): ?KilasyLasitra;
    public function save(KilasyLasitra $kilasyLasitra): void;
    public function delete(KilasyLasitra $kilasyLasitra): void;
}
