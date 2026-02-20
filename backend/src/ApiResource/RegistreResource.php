<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use DateTimeInterface;

#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => ['registre:read']]
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['registre:read']]
        ),
        new Post(
            normalizationContext: ['groups' => ['registre:read']],
            denormalizationContext: ['groups' => ['registre:write']]
        ),
        new Patch(
            normalizationContext: ['groups' => ['registre:read']],
            denormalizationContext: ['groups' => ['registre:write']]
        ),
        new Delete()
    ],
    routePrefix: '/sekoly-sabata',
    provider: \App\State\RegistreStateProvider::class,
    processor: \App\State\RegistreStateProcessor::class
)]
class RegistreResource
{
    #[Groups(['registre:read'])]
    public ?int $id = null;

    #[Groups(['registre:read', 'registre:write'])]
    public int $mambraTonga;

    #[Groups(['registre:read', 'registre:write'])]
    public int $mpamangy;

    #[Groups(['registre:read', 'registre:write'])]
    public int $nianatraImpito;

    #[Groups(['registre:read', 'registre:write'])]
    public int $asaSoa;

    #[Groups(['registre:read', 'registre:write'])]
    public int $fampianaranaBaiboly;

    #[Groups(['registre:read', 'registre:write'])]
    public int $bokyTrakta;

    #[Groups(['registre:read', 'registre:write'])]
    public int $semineraKaoferansa;

    #[Groups(['registre:read', 'registre:write'])]
    public int $alasarona;

    #[Groups(['registre:read', 'registre:write'])]
    public int $nahavitaFampTaratasy;

    #[Groups(['registre:read', 'registre:write'])]
    public int $batisaTami;

    #[Groups(['registre:read', 'registre:write'])]
    public float $fanatitra;

    #[Groups(['registre:read', 'registre:write'])]
    public DateTimeInterface $createdAt;

    #[Groups(['registre:read', 'registre:write'])]
    public int $kilasyId;

    #[Groups(['registre:read'])]
    public int $tongaRehetra;

    #[Groups(['registre:read', 'registre:write'])]
    public int $asafi;

    #[Groups(['registre:read'])]
    public ?int $nbrMambraKilasy = null;
}
