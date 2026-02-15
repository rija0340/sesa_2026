<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\RegistreResource;
use App\Entity\Registre;
use App\Repository\RegistreRepositoryInterface;

class RegistreStateProvider implements ProviderInterface
{
    private RegistreRepositoryInterface $registreRepository;

    public function __construct(RegistreRepositoryInterface $registreRepository)
    {
        $this->registreRepository = $registreRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'] ?? null;
        
        if ($id) {
            $registre = $this->registreRepository->findById((int)$id);
            return $this->transformEntityToResource($registre);
        }
        
        $registres = $this->registreRepository->findAll();
        return array_map([$this, 'transformEntityToResource'], $registres);
    }

    private function transformEntityToResource(?Registre $registre): ?RegistreResource
    {
        if (!$registre) {
            return null;
        }

        $resource = new RegistreResource();
        $resource->id = $registre->getId();
        $resource->mambraTonga = $registre->getMambraTonga();
        $resource->mpamangy = $registre->getMpamangy();
        $resource->nianatraImpito = $registre->getNianatraImpito();
        $resource->asaSoa = $registre->getAsaSoa();
        $resource->fampianaranaBaiboly = $registre->getFampianaranaBaiboly();
        $resource->bokyTrakta = $registre->getBokyTrakta();
        $resource->semineraKaoferansa = $registre->getSemineraKaoferansa();
        $resource->alasarona = $registre->getAlasarona();
        $resource->nahavitaFampTaratasy = $registre->getNahavitaFampTaratasy();
        $resource->batisaTami = $registre->getBatisaTami();
        $resource->fanatitra = $registre->getFanatitra();
        $resource->createdAt = $registre->getCreatedAt();
        $resource->kilasyId = $registre->getKilasy() ? $registre->getKilasy()->getId() : 0;
        $resource->tongaRehetra = $registre->getTongaRehetra();
        $resource->asafi = $registre->getAsafi();
        $resource->nbrMambraKilasy = $registre->getNbrMambraKilasy();

        return $resource;
    }
}
