<?php

namespace App\Repository;

use App\Entity\Kilasy;
use Doctrine\ORM\EntityManagerInterface;

class KilasyRepository implements KilasyRepositoryInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function findAll(): array
    {
        return $this->entityManager->getRepository(Kilasy::class)->findAll();
    }

    public function findById(int $id): ?Kilasy
    {
        return $this->entityManager->find(Kilasy::class, $id);
    }

    public function save(Kilasy $kilasy): void
    {
        $this->entityManager->persist($kilasy);
        $this->entityManager->flush();
    }

    public function delete(Kilasy $kilasy): void
    {
        $this->entityManager->remove($kilasy);
        $this->entityManager->flush();
    }
}