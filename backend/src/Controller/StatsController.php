<?php

namespace App\Controller;

use App\Repository\KilasyRepositoryInterface;
use App\Repository\RegistreRepositoryInterface;
use App\Entity\Registre;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/stats')]
class StatsController extends AbstractController
{
    private KilasyRepositoryInterface $kilasyRepository;
    private RegistreRepositoryInterface $registreRepository;

    public function __construct(
        KilasyRepositoryInterface $kilasyRepository,
        RegistreRepositoryInterface $registreRepository
    ) {
        $this->kilasyRepository = $kilasyRepository;
        $this->registreRepository = $registreRepository;
    }

    #[Route('/kilasy/{id}', name: 'stats_kilasy', methods: ['GET'])]
    public function getStatsKilasy(int $id): JsonResponse
    {
        $kilasy = $this->kilasyRepository->findById($id);
        if (!$kilasy) {
            return new JsonResponse(['error' => 'Classe non trouvée'], 404);
        }

        $stats = $kilasy->getStatistiques();

        return new JsonResponse([
            'kilasy' => [
                'id' => $kilasy->getId(),
                'nom' => $kilasy->getNom(),
                'description' => $kilasy->getDescription(),
            ],
            'statistiques' => $stats
        ]);
    }

    #[Route('/periode', name: 'stats_periode', methods: ['GET'])]
    public function getStatsPeriode(Request $request): JsonResponse
    {
        $dateDebutStr = $request->query->get('date_debut');
        $dateFinStr = $request->query->get('date_fin');

        if (!$dateDebutStr || !$dateFinStr) {
            return new JsonResponse(['error' => 'Les paramètres date_debut et date_fin sont requis'], 400);
        }

        try {
            $dateDebut = new \DateTime($dateDebutStr);
            $dateFin = new \DateTime($dateFinStr);
            // Include the end date fully (end of day) if it's just a date
            if (strlen($dateFinStr) <= 10) {
                $dateFin->setTime(23, 59, 59);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date invalide'], 400);
        }

        $registres = $this->registreRepository->findAll();

        // Filter by date
        $registresPeriode = array_filter($registres, function ($registre) use ($dateDebut, $dateFin) {
            $dateRegistre = $registre->getCreatedAt();
            return $dateRegistre >= $dateDebut && $dateRegistre <= $dateFin;
        });

        // Calculate global stats
        $stats = $this->calculerStatistiquesCollectives($registresPeriode);

        // Prepare raw data for frontend matrix
        $data = [];
        foreach ($registresPeriode as $r) {
            $data[] = $this->serializeRegistre($r);
        }

        return new JsonResponse([
            'periode' => [
                'du' => $dateDebut->format('Y-m-d'),
                'au' => $dateFin->format('Y-m-d'),
            ],
            'statistiques' => $stats,
            'data' => $data
        ]);
    }

    #[Route('/kilasy/{id}/periode', name: 'stats_kilasy_periode', methods: ['GET'])]
    public function getStatsKilasyPeriode(int $id, Request $request): JsonResponse
    {
        $kilasy = $this->kilasyRepository->findById($id);
        if (!$kilasy) {
            return new JsonResponse(['error' => 'Classe non trouvée'], 404);
        }

        $dateDebutStr = $request->query->get('date_debut');
        $dateFinStr = $request->query->get('date_fin');

        if (!$dateDebutStr || !$dateFinStr) {
            return new JsonResponse(['error' => 'Les paramètres date_debut et date_fin sont requis'], 400);
        }

        try {
            $dateDebut = new \DateTime($dateDebutStr);
            $dateFin = new \DateTime($dateFinStr);
            if (strlen($dateFinStr) <= 10) {
                $dateFin->setTime(23, 59, 59);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date invalide'], 400);
        }

        $registres = $this->registreRepository->findByKilasyId($id);

        $registresPeriode = array_filter($registres, function ($registre) use ($dateDebut, $dateFin) {
            $dateRegistre = $registre->getCreatedAt();
            return $dateRegistre >= $dateDebut && $dateRegistre <= $dateFin;
        });

        $stats = $this->calculerStatistiquesCollectives($registresPeriode);

        // Prepare raw data
        $data = [];
        foreach ($registresPeriode as $r) {
            $data[] = $this->serializeRegistre($r);
        }

        return new JsonResponse([
            'kilasy' => [
                'id' => $kilasy->getId(),
                'nom' => $kilasy->getNom(),
                'description' => $kilasy->getDescription(),
            ],
            'periode' => [
                'du' => $dateDebut->format('Y-m-d'),
                'au' => $dateFin->format('Y-m-d'),
            ],
            'statistiques' => $stats,
            'data' => $data
        ]);
    }

    private function calculerStatistiquesCollectives(array $registres): array
    {
        if (empty($registres)) {
            return [
                'totalRegistres' => 0,
                'moyennePresence' => 0,
                'moyenneApprentissage' => 0,
                'totalMembresTonga' => 0,
                'totalNianatraImpito' => 0,
            ];
        }

        // Filtre pour exclure les classes sans données (mambraTonga = 0)
        // car on considère que ces classes n'étaient pas présentes/actives
        $registresActifs = array_filter($registres, function ($r) {
            return $r->getMambraTonga() > 0;
        });

        if (empty($registresActifs)) {
            return [
                'totalRegistres' => count($registres),
                'moyennePresence' => 0,
                'moyenneApprentissage' => 0,
                'totalMembresTonga' => 0,
                'totalNianatraImpito' => 0,
            ];
        }

        $totalRegistresActifs = count($registresActifs);
        $totalPresence = 0;
        $totalApprentissage = 0;
        $totalMembresTonga = 0;
        $totalNianatraImpito = 0;

        foreach ($registresActifs as $registre) {
            /** @var Registre $registre */
            $totalPresence += $registre->getPourcentagePresence();
            $totalApprentissage += $registre->getPourcentageApprentissage();
            $totalMembresTonga += $registre->getMambraTonga();
            $totalNianatraImpito += $registre->getNianatraImpito();
        }

        return [
            'totalRegistres' => count($registres),
            'totalRegistresActifs' => $totalRegistresActifs,
            'moyennePresence' => round($totalPresence / $totalRegistresActifs, 2),
            'moyenneApprentissage' => round($totalApprentissage / $totalRegistresActifs, 2),
            'totalMembresTonga' => $totalMembresTonga,
            'totalNianatraImpito' => $totalNianatraImpito,
        ];
    }

    private function serializeRegistre(Registre $r): array
    {
        return [
            'id' => $r->getId(),
            'date' => $r->getCreatedAt()->format('Y-m-d'),
            'kilasy' => $r->getKilasy() ? $r->getKilasy()->getNom() : 'Inconnue',
            'mambraTonga' => $r->getMambraTonga(),
            'mpamangy' => $r->getMpamangy(),
            'tongaRehetra' => $r->getTongaRehetra(),
            'nianatraImpito' => $r->getNianatraImpito(),
            'asafi' => $r->getAsafi(),
            'asaSoa' => $r->getAsaSoa(),
            'fampianaranaBaiboly' => $r->getFampianaranaBaiboly(),
            'bokyTrakta' => $r->getBokyTrakta(),
            'semineraKaoferansa' => $r->getSemineraKaoferansa(),
            'alasarona' => $r->getAlasarona(),
            'nahavitaFampTaratasy' => $r->getNahavitaFampTaratasy(),
            'batisaTami' => $r->getBatisaTami(),
            'fanatitra' => $r->getFanatitra(),
            'pourcentTonga' => $r->getPourcentagePresence(),
            'pourcentImpito' => $r->getPourcentageApprentissage(),
        ];
    }
}