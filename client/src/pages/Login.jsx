import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Component() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  // Função para esconder o alerta
  const hideAlert = () => {
    setAlertVisible(false);
    setTimeout(() => {
      setShowAlert(false);
      setError(""); // Limpar a mensagem de erro
    }, 300); // Tempo igual à duração da transição
  };

  // Efeito para esconder o alerta automaticamente após 5 segundos
  useEffect(() => {
    if (showAlert) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000); // 5000 ms = 5 segundos

      return () => clearTimeout(timer); // Limpeza do timer
    }
  }, [showAlert]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1000/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Login realizado com sucesso.");
        setError("");
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setShowAlert(true); // Mostrar o alerta
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1000/register",
        { name, email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Registro realizado com sucesso.");
        setError("");
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setShowAlert(true); // Mostrar o alerta
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#161616] px-4">
      {showAlert && (
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-center text-white transition-opacity duration-300 ease-in-out ${
            alertVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      <Card className="w-full max-w-md bg-[#181a1b] text-white">
        <CardHeader>
          <Link href={"/"} className="mb-4 text-white">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Entrar" : "Registrar"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Insira seu e-mail e senha para acessar sua conta."
              : "Crie uma nova conta inserindo seus dados abaixo."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-black bg-yellow-500 hover:bg-yellow-600 font-bold relative"
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? <Spinner /> : isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </CardFooter>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-400">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
          </span>{" "}
          <Button
            variant="link"
            onClick={() => setIsLogin((prev) => !prev)}
            className="font-medium underline-offset-4 hover:underline text-white mb-4"
          >
            {isLogin ? "Registrar" : "Entrar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
