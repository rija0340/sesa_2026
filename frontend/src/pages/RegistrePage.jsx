import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Box,
  Paper,
  Table,
  Group,
  Button,
  Modal,
  NumberInput,
  TextInput,
  Select,
  ActionIcon,
  Badge,
  Loader,
  Alert,
  Tooltip,
  ScrollArea,
  SimpleGrid,
  Stack,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useApi from "../hooks/useApi";
import {
  getRegistres,
  createRegistre,
  updateRegistre,
  deleteRegistre,
} from "../api/registre";
import { getKilasys } from "../api/kilasy";

/* ── Icons ─────────────────────────────────────────────────────── */
function IconEdit() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ── Registre fields definition ────────────────────────────────── */
const REGISTRE_FIELDS = [
  { key: "mambraTonga", label: "Membres présents", min: 0 },
  { key: "mpamangy", label: "Visiteurs", min: 0 },
  { key: "tongaRehetra", label: "Total présents", min: 0 },
  { key: "nianatraImpito", label: "Ont étudié la leçon", min: 0 },
  { key: "asaSoa", label: "Asa soa", min: 0 },
  { key: "fampianaranaBaiboly", label: "Études bibliques", min: 0 },
  { key: "bokyTrakta", label: "Livres / tracts", min: 0 },
  { key: "semineraKaoferansa", label: "Séminaires / conférences", min: 0 },
  { key: "alasarona", label: "Alasarona", min: 0 },
  { key: "nahavitaFampTaratasy", label: "Correspondances terminées", min: 0 },
  { key: "batisaTami", label: "Baptêmes / tami", min: 0 },
  { key: "asafi", label: "ASAFI", min: 0 },
  { key: "fanatitra", label: "Offrande (Ar)", min: 0, precision: 2 },
];

const EMPTY_FORM = {
  kilasyId: null,
  mambraTonga: 0,
  mpamangy: 0,
  tongaRehetra: 0,
  nianatraImpito: 0,
  asaSoa: 0,
  fampianaranaBaiboly: 0,
  bokyTrakta: 0,
  semineraKaoferansa: 0,
  alasarona: 0,
  nahavitaFampTaratasy: 0,
  batisaTami: 0,
  asafi: 0,
  fanatitra: 0,
  nbrMambraKilasy: null,
  createdAt: new Date().toISOString().split("T")[0],
};

export default function RegistrePage() {
  const { data: registres, loading, error, execute: reload } = useApi(getRegistres);
  const { data: kilasys } = useApi(getKilasys);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const kilasyList = Array.isArray(kilasys) ? kilasys : [];
  const kilasyOptions = kilasyList.map((k) => ({
    value: String(k.id),
    label: k.nom,
  }));

  function getKilasyName(kilasyId) {
    const k = kilasyList.find((x) => String(x?.id) === String(kilasyId));
    return k ? k.nom : `#${kilasyId}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function handleNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, createdAt: new Date().toISOString().split("T")[0] });
    setFormError(null);
    openForm();
  }

  function handleEdit(r) {
    setEditingId(r.id);
    setForm({
      kilasyId: r.kilasyId,
      mambraTonga: r.mambraTonga,
      mpamangy: r.mpamangy,
      tongaRehetra: r.tongaRehetra,
      nianatraImpito: r.nianatraImpito,
      asaSoa: r.asaSoa,
      fampianaranaBaiboly: r.fampianaranaBaiboly,
      bokyTrakta: r.bokyTrakta,
      semineraKaoferansa: r.semineraKaoferansa,
      alasarona: r.alasarona,
      nahavitaFampTaratasy: r.nahavitaFampTaratasy,
      batisaTami: r.batisaTami,
      asafi: r.asafi,
      fanatitra: r.fanatitra,
      nbrMambraKilasy: r.nbrMambraKilasy,
      createdAt: r.createdAt ? r.createdAt.split("T")[0] : "",
    });
    setFormError(null);
    openForm();
  }

  function handleView(r) {
    setSelected(r);
    openDetail();
  }

  function handleDeleteClick(r) {
    setSelected(r);
    openDelete();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.kilasyId) {
      setFormError("La classe est obligatoire");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const numericFields = REGISTRE_FIELDS.reduce((acc, field) => {
        acc[field.key] = Number(form[field.key]) || 0;
        return acc;
      }, {});

      const payload = {
        ...numericFields,
        nbrMambraKilasy:
          form.nbrMambraKilasy === null || form.nbrMambraKilasy === ""
            ? null
            : Number(form.nbrMambraKilasy),
        kilasyId: Number(form.kilasyId),
        createdAt: form.createdAt + "T00:00:00+00:00",
      };
      if (editingId) {
        await updateRegistre(editingId, payload);
      } else {
        await createRegistre(payload);
      }
      closeForm();
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true);
    try {
      await deleteRegistre(selected.id);
      closeDelete();
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const list = Array.isArray(registres) ? registres : [];

  // Logic for summary recaps (last 5 dates)
  const last5Dates = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .reduce((acc, curr) => {
      const d = formatDate(curr.createdAt);
      const existing = acc.find((x) => x.date === d);
      if (existing) {
        existing.count += 1;
      } else if (acc.length < 5) {
        acc.push({ date: d, count: 1 });
      }
      return acc;
    }, []);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} mb={4}>Registre</Title>
          <Text c="dimmed">Suivi hebdomadaire des activités</Text>
        </Box>
        <Button leftSection={<IconPlus />} onClick={handleNew}>
          Nouveau registre
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlert />} color="red" mb="lg" title="Erreur">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
        {/* ── Summary Column ─────────────────────────────────── */}
        <Box style={{ gridColumn: "span 1" }}>
          <Stack gap="lg">
            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Title order={5} mb="md" c="green.8">
                Info sur les 5 dernières dates
              </Title>
              <Text size="sm" mb="sm">
                Classes totales : <strong>{kilasyList.length}</strong>
              </Text>
              <Table variant="unstyled" size="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th align="right">Registres</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {last5Dates.length > 0 ? (
                    last5Dates.map((item, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>{item.date}</Table.Td>
                        <Table.Td align="right">
                          <Badge variant="light" color="green">
                            {item.count}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Text size="xs" c="dimmed" ta="center">
                          Aucune donnée
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Paper>

            {/* Optional additional info card */}
            <Paper shadow="sm" radius="md" p="md" withBorder bg="blue.0">
              <Group gap="xs">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mantine-color-blue-filled)" }} />
                <Text size="xs" fw={700} tt="uppercase">Astuce</Text>
              </Group>
              <Text size="xs" mt="xs">
                Utilisez le bouton <strong>Détails</strong> (œil) pour voir l'ensemble des indicateurs saisis pour chaque classe.
              </Text>
            </Paper>
          </Stack>
        </Box>

        {/* ── Main List Column ─────────────────────────────── */}
        <Box style={{ gridColumn: "span 3" }}>
          <Paper shadow="sm" radius="md" withBorder>
            {loading ? (
              <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
                <Loader />
              </Box>
            ) : list.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                Aucun registre trouvé. Cliquez sur « Nouveau registre » pour commencer.
              </Text>
            ) : (
              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Classe</Table.Th>
                      <Table.Th>Présents</Table.Th>
                      <Table.Th>Visiteurs</Table.Th>
                      <Table.Th>Apprenants</Table.Th>
                      <Table.Th>Offrande</Table.Th>
                      <Table.Th style={{ width: 120 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {list.map((r) => (
                      <Table.Tr key={r.id}>
                        <Table.Td>{formatDate(r.createdAt)}</Table.Td>
                        <Table.Td fw={500}>{getKilasyName(r.kilasyId)}</Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="indigo">{r.mambraTonga}</Badge>
                        </Table.Td>
                        <Table.Td>{r.mpamangy}</Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="teal">{r.nianatraImpito}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="yellow">
                            {Number(r.fanatitra).toLocaleString("fr-FR")} Ar
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <Tooltip label="Détails">
                              <ActionIcon variant="subtle" color="gray" onClick={() => handleView(r)}>
                                <IconEye />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Modifier">
                              <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(r)}>
                                <IconEdit />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Supprimer">
                              <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(r)}>
                                <IconTrash />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Paper>
        </Box>
      </SimpleGrid>

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingId ? "Modifier le registre" : "Nouveau registre"}
        centered
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <Alert color="red" mb="md" icon={<IconAlert />}>{formError}</Alert>
          )}

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" align="flex-start">
            <Box style={{ gridColumn: "span 2" }}>
              <Select
                label="Classe"
                placeholder="Choisir une classe"
                required
                mb="md"
                data={kilasyOptions}
                value={form.kilasyId ? String(form.kilasyId) : null}
                onChange={(val) => updateField("kilasyId", val)}
                searchable
              />
              <TextInput
                label="Date"
                type="date"
                required
                mb="md"
                value={form.createdAt}
                onChange={(e) => updateField("createdAt", e.target.value)}
              />
              <NumberInput
                label="Nombre de membres (surcharge)"
                placeholder="Optionnel"
                mb="md"
                min={0}
                value={form.nbrMambraKilasy}
                onChange={(val) => updateField("nbrMambraKilasy", val)}
              />
            </Box>

            <Box style={{ gridColumn: "span 1" }}>
              <Paper shadow="xs" radius="md" p="sm" withBorder bg="gray.0">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
                  Info sur : {getKilasyName(form.kilasyId) || "—"}
                </Text>
                {form.kilasyId ? (() => {
                  const k = kilasyList.find(x => String(x.id) === String(form.kilasyId));
                  return (
                    <Stack gap={4}>
                      <Group justify="space-between">
                        <Text size="xs">Type nbr membre :</Text>
                        <Badge size="xs" variant="filled" color={k?.nbrMambraUsed === 'custom' ? 'teal' : 'blue'}>
                          {k?.nbrMambraUsed === 'custom' ? 'Custom' : 'Registre'}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">Membres (Custom) :</Text>
                        <Text size="xs" fw={700}>{k?.nbrMambra ?? 0}</Text>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs" style={{ fontStyle: 'italic' }}>
                        {k?.description || "Pas de description"}
                      </Text>
                    </Stack>
                  );
                })() : (
                  <Text size="xs" c="dimmed" ta="center">Sélectionnez une classe</Text>
                )}
              </Paper>
            </Box>
          </SimpleGrid>

          <Divider my="lg" label="Indicateurs de présence et activités" labelPosition="center" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {REGISTRE_FIELDS.map((field) => (
              <NumberInput
                key={field.key}
                label={field.label}
                min={field.min}
                decimalScale={field.precision}
                value={form[field.key]}
                onChange={(val) => updateField(field.key, val)}
              />
            ))}
          </SimpleGrid>
          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" onClick={closeForm}>Annuler</Button>
            <Button type="submit" loading={saving}>
              {editingId ? "Enregistrer" : "Créer"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      <Modal
        opened={detailOpened}
        onClose={closeDetail}
        title="Détails du registre"
        centered
        size="md"
      >
        {selected && (
          <Box>
            <SimpleGrid cols={2} spacing="sm">
              <Text size="sm" c="dimmed">Date</Text>
              <Text size="sm" fw={500}>{formatDate(selected.createdAt)}</Text>

              <Text size="sm" c="dimmed">Classe</Text>
              <Text size="sm" fw={500}>{getKilasyName(selected.kilasyId)}</Text>

              {REGISTRE_FIELDS.map((field) => (
                <React.Fragment key={field.key}>
                  <Text size="sm" c="dimmed">{field.label}</Text>
                  <Text size="sm" fw={500}>
                    {field.key === "fanatitra"
                      ? `${Number(selected[field.key]).toLocaleString("fr-FR")} Ar`
                      : selected[field.key]}
                  </Text>
                </React.Fragment>
              ))}

              <Text size="sm" c="dimmed">Nb membres (surcharge)</Text>
              <Text size="sm" fw={500}>{selected.nbrMambraKilasy ?? "—"}</Text>
            </SimpleGrid>
          </Box>
        )}
      </Modal>

      {/* ── Delete Confirmation ──────────────────────────────── */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirmer la suppression"
        centered
        size="sm"
      >
        <Text mb="xl">
          Supprimer ce registre du{" "}
          <strong>{selected ? formatDate(selected.createdAt) : ""}</strong> ? Cette action est irréversible.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDelete}>Annuler</Button>
          <Button color="red" onClick={handleDelete} loading={saving}>Supprimer</Button>
        </Group>
      </Modal>
    </Box>
  );
}
