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
            normalizationContext: ['groups' => ['registre:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['registre:read']],
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            normalizationContext: ['groups' => ['registre:read']],
            denormalizationContext: ['groups' => ['registre:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Patch(
            normalizationContext: ['groups' => ['registre:read']],
            denormalizationContext: ['groups' => ['registre:write']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    routePrefix: '/sekoly-sabata'
)]
class RegistreResource
{
    #[Groups(['registre:read'])]
    public ?int $id = null;

    #[Groups(['registre:read', 'registre:write'])]
    public int $mambraTonga = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $mpamangy = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $nianatraImpito = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $asaSoa = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $fampianaranaBaiboly = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $bokyTrakta = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $semineraKaoferansa = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $alasarona = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $nahavitaFampTaratasy = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $batisaTami = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public float $fanatitra = 0.0;

    #[Groups(['registre:read', 'registre:write'])]
    public DateTimeInterface $createdAt;

    #[Groups(['registre:read', 'registre:write'])]
    public int $kilasyId;

    #[Groups(['registre:read', 'registre:write'])]
    public int $tongaRehetra = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public int $asafi = 0;

    #[Groups(['registre:read', 'registre:write'])]
    public ?int $nbrMambraKilasy = null;
}