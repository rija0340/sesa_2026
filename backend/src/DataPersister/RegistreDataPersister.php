<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\RegistreResource;
use App\Entity\Registre;
use App\Repository\RegistreRepositoryInterface;
use App\Repository\KilasyRepositoryInterface;

class RegistreDataPersister implements ProviderInterface
{
    private RegistreRepositoryInterface $registreRepository;
    private KilasyRepositoryInterface $kilasyRepository;

    public function __construct(
        RegistreRepositoryInterface $registreRepository,
        KilasyRepositoryInterface $kilasyRepository
    ) {
        $this->registreRepository = $registreRepository;
        $this->kilasyRepository = $kilasyRepository;
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

    public function transformEntityToResource(?Registre $registre): ?RegistreResource
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

    public function transformResourceToEntity(RegistreResource $resource, ?Registre $entity = null): Registre
    {
        $entity = $entity ?? new Registre();
        
        $kilasy = $this->kilasyRepository->findById($resource->kilasyId);
        if (!$kilasy) {
            throw new \Exception("Classe introuvable avec l'ID: {$resource->kilasyId}");
        }

        $entity->setMambraTonga($resource->mambraTonga)
               ->setMpamangy($resource->mpamangy)
               ->setNianatraImpito($resource->nianatraImpito)
               ->setAsaSoa($resource->asaSoa)
               ->setFampianaranaBaiboly($resource->fampianaranaBaiboly)
               ->setBokyTrakta($resource->bokyTrakta)
               ->setCreatedAt($resource->createdAt)
               ->setKilasy($kilasy)
               ->setSemineraKaoferansa($resource->semineraKaoferansa)
               ->setAlasarona($resource->alasarona)
               ->setNahavitaFampTaratasy($resource->nahavitaFampTaratasy)
               ->setBatisaTami($resource->batisaTami)
               ->setFanatitra($resource->fanatitra)
               ->setTongaRehetra($resource->tongaRehetra)
               ->setAsafi($resource->asafi)
               ->setNbrMambraKilasy($resource->nbrMambraKilasy);

        return $entity;
    }
}