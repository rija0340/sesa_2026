import React, { useState } from "react";
import {
  Title,
  Text,
  Box,
  Paper,
  Table,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  ActionIcon,
  Badge,
  Loader,
  Alert,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useApi from "../hooks/useApi";
import {
  getKilasys,
  createKilasy,
  updateKilasy,
  deleteKilasy,
} from "../api/kilasy";

/* ── Inline icons ──────────────────────────────────────────────── */
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

const EMPTY_FORM = {
  nom: "",
  description: "",
  nbrMambra: null,
  nbrMambraUsed: "registre",
};

export default function KilasyPage() {
  const { data: kilasys, loading, error, execute: reload } = useApi(getKilasys);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    openForm();
  }

  function handleEdit(k) {
    setEditingId(k.id);
    setForm({
      nom: k.nom || "",
      description: k.description || "",
      nbrMambra: k.nbrMambra,
      nbrMambraUsed: k.nbrMambraUsed || "registre",
    });
    setFormError(null);
    openForm();
  }

  function handleDeleteClick(k) {
    setSelected(k);
    openDelete();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nom.trim()) {
      setFormError("Le nom est obligatoire");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        nom: form.nom.trim(),
        description: form.description?.trim() || null,
        nbrMambra:
          form.nbrMambra === null || form.nbrMambra === ""
            ? null
            : Number(form.nbrMambra),
        nbrMambraUsed: form.nbrMambraUsed || "registre",
      };

      if (editingId) {
        await updateKilasy(editingId, payload);
      } else {
        await createKilasy(payload);
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
      await deleteKilasy(selected.id);
      closeDelete();
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const list = Array.isArray(kilasys) ? kilasys : [];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} mb={4}>Kilasy</Title>
          <Text c="dimmed">Gestion des classes du Sekoly Sabata</Text>
        </Box>
        <Button leftSection={<IconPlus />} onClick={handleNew}>
          Nouvelle classe
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlert />} color="red" mb="lg" title="Erreur">
          {error}
        </Alert>
      )}

      <Paper shadow="sm" radius="md" withBorder>
        {loading ? (
          <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
            <Loader />
          </Box>
        ) : list.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            Aucune classe trouvée. Cliquez sur « Nouvelle classe » pour commencer.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nom</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Membres</Table.Th>
                <Table.Th>Source membres</Table.Th>
                <Table.Th style={{ width: 100 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {list.map((k) => (
                <Table.Tr key={k.id}>
                  <Table.Td fw={500}>{k.nom}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {k.description || "—"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="indigo">
                      {k.nbrMambra ?? "—"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="dot" color={k.nbrMambraUsed === "custom" ? "teal" : "gray"}>
                      {k.nbrMambraUsed === "custom" ? "Manuel" : "Registre"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Tooltip label="Modifier">
                        <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(k)}>
                          <IconEdit />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(k)}>
                          <IconTrash />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      {/* ── Form Modal ───────────────────────────────────────── */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingId ? "Modifier la classe" : "Nouvelle classe"}
        centered
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <Alert color="red" mb="md" icon={<IconAlert />}>
              {formError}
            </Alert>
          )}
          <TextInput
            label="Nom"
            placeholder="Nom de la classe"
            required
            mb="md"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Description (optionnel)"
            mb="md"
            autosize
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <NumberInput
            label="Nombre de membres"
            placeholder="Optionnel"
            mb="md"
            min={0}
            value={form.nbrMambra}
            onChange={(val) => setForm({ ...form, nbrMambra: val })}
          />
          <Select
            label="Source du nombre de membres"
            data={[
              { value: "registre", label: "Depuis le registre" },
              { value: "custom", label: "Manuel" },
            ]}
            mb="xl"
            value={form.nbrMambraUsed}
            onChange={(val) => setForm({ ...form, nbrMambraUsed: val })}
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? "Enregistrer" : "Créer"}
            </Button>
          </Group>
        </form>
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
          Supprimer la classe <strong>{selected?.nom}</strong> ? Cette action est irréversible.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDelete}>
            Annuler
          </Button>
          <Button color="red" onClick={handleDelete} loading={saving}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
