<?php

namespace App\Repository;

use App\Entity\Kilasy;

interface KilasyRepositoryInterface
{
    public function findAll(): array;
    public function findById(int $id): ?Kilasy;
    public function save(Kilasy $kilasy): void;
    public function delete(Kilasy $kilasy): void;
}