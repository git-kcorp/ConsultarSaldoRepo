import { Button, Container } from "@mui/material";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { login } = useAuth();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={login}
        sx={{ mt: 2, width: "100%" }}
      >
        Iniciar con Google
      </Button>
    </Container>
  );
};

export default Login;
