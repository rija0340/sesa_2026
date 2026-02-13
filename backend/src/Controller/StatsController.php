<?php

namespace App\Controller;

use App\Repository\KilasyRepositoryInterface;
use App\Repository\RegistreRepositoryInterface;
use App\Entity\Registre;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stats')]
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
        $dateDebut = $request->query->get('date_debut');
        $dateFin = $request->query->get('date_fin');
        
        if (!$dateDebut || !$dateFin) {
            return new JsonResponse(['error' => 'Les paramètres date_debut et date_fin sont requis'], 400);
        }

        $dateDebut = new \DateTime($dateDebut);
        $dateFin = new \DateTime($dateFin);
        
        $registres = $this->registreRepository->findAll();
        
        $registresPeriode = array_filter($registres, function($registre) use ($dateDebut, $dateFin) {
            $dateRegistre = $registre->getCreatedAt();
            return $dateRegistre >= $dateDebut && $dateRegistre <= $dateFin;
        });

        $stats = $this->calculerStatistiquesCollectives($registresPeriode);
        
        return new JsonResponse([
            'periode' => [
                'du' => $dateDebut->format('Y-m-d'),
                'au' => $dateFin->format('Y-m-d'),
            ],
            'statistiques' => $stats
        ]);
    }

    #[Route('/kilasy/{id}/periode', name: 'stats_kilasy_periode', methods: ['GET'])]
    public function getStatsKilasyPeriode(int $id, Request $request): JsonResponse
    {
        $kilasy = $this->kilasyRepository->findById($id);
        if (!$kilasy) {
            return new JsonResponse(['error' => 'Classe non trouvée'], 404);
        }

        $dateDebut = $request->query->get('date_debut');
        $dateFin = $request->query->get('date_fin');
        
        if (!$dateDebut || !$dateFin) {
            return new JsonResponse(['error' => 'Les paramètres date_debut et date_fin sont requis'], 400);
        }

        $dateDebut = new \DateTime($dateDebut);
        $dateFin = new \DateTime($dateFin);
        
        $registres = $this->registreRepository->findByKilasyId($id);
        
        $registresPeriode = array_filter($registres, function($registre) use ($dateDebut, $dateFin) {
            $dateRegistre = $registre->getCreatedAt();
            return $dateRegistre >= $dateDebut && $dateRegistre <= $dateFin;
        });

        $stats = $this->calculerStatistiquesCollectives($registresPeriode);
        
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
            'statistiques' => $stats
        ]);
    }

    /**
     * Méthode utilitaire pour calculer les statistiques sur un ensemble de registres
     */
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

        $totalRegistres = count($registres);
        $totalPresence = 0;
        $totalApprentissage = 0;
        $totalMembresTonga = 0;
        $totalNianatraImpito = 0;

        foreach ($registres as $registre) {
            /** @var Registre $registre */
            $totalPresence += $registre->getPourcentagePresence();
            $totalApprentissage += $registre->getPourcentageApprentissage();
            $totalMembresTonga += $registre->getMambraTonga();
            $totalNianatraImpito += $registre->getNianatraImpito();
        }

        return [
            'totalRegistres' => $totalRegistres,
            'moyennePresence' => round($totalPresence / $totalRegistres, 2),
            'moyenneApprentissage' => round($totalApprentissage / $totalRegistres, 2),
            'totalMembresTonga' => $totalMembresTonga,
            'totalNianatraImpito' => $totalNianatraImpito,
        ];
    }
}