import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Alert,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { login } from "../api/auth";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value ? null : "Nom d'utilisateur requis"),
      password: (value) => (value ? null : "Mot de passe requis"),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.username, values.password);
      // Redirection vers l'accueil après login
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Bienvenue !</Title>
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {error && (
            <Alert color="red" mb="md" title="Erreur">
              {error}
            </Alert>
          )}

          <TextInput
            label="Nom d'utilisateur"
            placeholder="raberia"
            required
            mb="md"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            required
            mb="lg"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Se connecter
          </Button>

          <Box mt="md" ta="center" c="dimmed" fz="sm">
            <p>Compte de test : <strong>raberia</strong> / <strong>random123</strong></p>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
