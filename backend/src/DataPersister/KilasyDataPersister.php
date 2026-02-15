<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\KilasyResource;
use App\Entity\Kilasy;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\KilasyLasitraRepositoryInterface;

class KilasyDataPersister implements ProviderInterface
{
    private KilasyRepositoryInterface $kilasyRepository;
    private KilasyLasitraRepositoryInterface $kilasyLasitraRepository;

    public function __construct(
        KilasyRepositoryInterface $kilasyRepository,
        KilasyLasitraRepositoryInterface $kilasyLasitraRepository
    ) {
        $this->kilasyRepository = $kilasyRepository;
        $this->kilasyLasitraRepository = $kilasyLasitraRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'] ?? null;
        
        if ($id) {
            $kilasy = $this->kilasyRepository->findById((int)$id);
            return $this->transformEntityToResource($kilasy);
        }
        
        $kilasyList = $this->kilasyRepository->findAll();
        return array_map([$this, 'transformEntityToResource'], $kilasyList);
    }

    public function transformEntityToResource(?Kilasy $kilasy): ?KilasyResource
    {
        if (!$kilasy) {
            return null;
        }

        $resource = new KilasyResource();
        $resource->id = $kilasy->getId();
        $resource->nom = $kilasy->getNom();
        $resource->description = $kilasy->getDescription();
        $resource->nbrMambra = $kilasy->getNbrMambra();
        $resource->nbrMambraUsed = $kilasy->getNbrMambraUsed();
        
        if ($kilasy->getKilasyLasitra()) {
            $resource->kilasyLasitraId = $kilasy->getKilasyLasitra()->getId();
        }

        return $resource;
    }

    public function transformResourceToEntity(KilasyResource $resource, ?Kilasy $entity = null): Kilasy
    {
        $entity = $entity ?? new Kilasy();
        
        $entity->setNom($resource->nom)
               ->setDescription($resource->description)
               ->setNbrMambra($resource->nbrMambra)
               ->setNbrMambraUsed($resource->nbrMambraUsed);

        if ($resource->kilasyLasitraId) {
            $kilasyLasitra = $this->kilasyLasitraRepository->findById($resource->kilasyLasitraId);
            if ($kilasyLasitra) {
                $entity->setKilasyLasitra($kilasyLasitra);
            }
        }

        return $entity;
    }
}
