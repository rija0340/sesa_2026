<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\KilasyResource;
use App\Entity\Kilasy;
use App\Repository\KilasyRepositoryInterface;
use App\Repository\KilasyLasitraRepositoryInterface;

class KilasyStateProvider implements ProviderInterface
{
    private KilasyRepositoryInterface $kilasyRepository;

    public function __construct(
        KilasyRepositoryInterface $kilasyRepository
    ) {
        $this->kilasyRepository = $kilasyRepository;
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

    private function transformEntityToResource(?Kilasy $kilasy): ?KilasyResource
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
}
