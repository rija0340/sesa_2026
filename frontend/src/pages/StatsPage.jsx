import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Box,
  Paper,
  SimpleGrid,
  Group,
  Select,
  RingProgress,
  Badge,
  Loader,
  Alert,
  TextInput,
  Button,
  Table,
  ScrollArea,
} from "@mantine/core";
import useApi from "../hooks/useApi";
import { getKilasys } from "../api/kilasy";
import {
  getStatsKilasy,
  getStatsPeriode,
  getStatsKilasyPeriode,
} from "../api/registre";

function IconAlert() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function StatCard({ title, value, suffix, color }) {
  const numValue = typeof value === "number" ? value : 0;
  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={800} mt="sm" style={{ fontSize: 36, lineHeight: 1 }}>
            {typeof value === "number" ? value.toLocaleString("fr-FR") : "—"}
            {suffix && (
              <Text span size="lg" fw={600} c="dimmed">
                {" "}{suffix}
              </Text>
            )}
          </Text>
        </Box>
        <RingProgress
          size={60}
          thickness={5}
          roundCaps
          sections={[{ value: Math.min(numValue, 100), color }]}
        />
      </Group>
    </Paper>
  );
}

export default function StatsPage() {
  const { data: kilasys } = useApi(getKilasys);
  const [kilasyId, setKilasyId] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const kilasyList = Array.isArray(kilasys) ? kilasys : [];
  const kilasyOptions = kilasyList.map((k) => ({
    value: String(k.id),
    label: k.nom,
  }));

  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (kilasyId && dateDebut && dateFin) {
        result = await getStatsKilasyPeriode(kilasyId, dateDebut, dateFin);
      } else if (kilasyId) {
        result = await getStatsKilasy(kilasyId);
      } else if (dateDebut && dateFin) {
        result = await getStatsPeriode(dateDebut, dateFin);
      } else {
        setStats(null);
        setLoading(false);
        return;
      }
      setStats(result);
    } catch (err) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (kilasyId || (dateDebut && dateFin)) {
      loadStats();
    }
  }, [kilasyId]);

  const s = stats?.statistiques;

  return (
    <Box>
      <Group justify="space-between" mb="xl" align="flex-start" wrap="wrap">
        <Box>
          <Title order={2} mb={4}>Statistiques</Title>
          <Text c="dimmed">Analyse des données du Sekoly Sabata</Text>
        </Box>
      </Group>

      {/* ── Filters ──────────────────────────────────────────── */}
      <Paper shadow="sm" radius="md" p="lg" withBorder mb="xl">
        <Text fw={600} mb="md">Filtrer</Text>
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
          <Select
            label="Classe"
            placeholder="Toutes les classes"
            data={kilasyOptions}
            value={kilasyId}
            onChange={setKilasyId}
            clearable
            searchable
          />
          <TextInput
            label="Date début"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
          <TextInput
            label="Date fin"
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
          <Box style={{ display: "flex", alignItems: "flex-end" }}>
            <Button
              fullWidth
              onClick={loadStats}
              disabled={!kilasyId && (!dateDebut || !dateFin)}
            >
              Rechercher
            </Button>
          </Box>
        </SimpleGrid>
      </Paper>

      {error && (
        <Alert icon={<IconAlert />} color="red" mb="lg" title="Erreur">
          {error}
        </Alert>
      )}

      {loading && (
        <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </Box>
      )}

      {!loading && !s && !error && (
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Text ta="center" c="dimmed">
            Sélectionnez une classe ou une période pour afficher les statistiques.
          </Text>
        </Paper>
      )}

      {s && (
        <>
          {/* Info header */}
          {stats.kilasy && (
            <Group mb="lg" gap="sm">
              <Badge size="lg" variant="filled" color="indigo">
                {stats.kilasy.nom}
              </Badge>
              {stats.periode && (
                <Badge size="lg" variant="outline">
                  {stats.periode.du} → {stats.periode.au}
                </Badge>
              )}
            </Group>
          )}
          {!stats.kilasy && stats.periode && (
            <Group mb="lg" gap="sm">
              <Badge size="lg" variant="outline">
                {stats.periode.du} → {stats.periode.au}
              </Badge>
            </Group>
          )}

          {/* Stat cards */}
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }} spacing="lg" mb="xl">
            <StatCard
              title="Total registres"
              value={s.totalRegistres}
              color="indigo"
            />
            <StatCard
              title="Présence moyenne"
              value={s.tauxMoyenPresence ?? s.moyennePresence}
              suffix="%"
              color="teal"
            />
            <StatCard
              title="Apprentissage moyen"
              value={s.tauxMoyenApprentissage ?? s.moyenneApprentissage}
              suffix="%"
              color="cyan"
            />
            {s.totalMembresTonga !== undefined && (
              <StatCard
                title="Total présents"
                value={s.totalMembresTonga}
                color="violet"
              />
            )}
            {s.totalNianatraImpito !== undefined && (
              <StatCard
                title="Total apprenants"
                value={s.totalNianatraImpito}
                color="orange"
              />
            )}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
