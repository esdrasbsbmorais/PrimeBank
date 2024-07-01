import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const hideAlert = () => {
    setAlertVisible(false);
    setTimeout(() => {
      setShowAlert(false);
      setError("");
    }, 300);
  };

  useEffect(() => {
    if (showAlert) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1000/api/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Login realizado com sucesso.");
        localStorage.setItem("token", response.data.token);
        window.location.href = "/Dashboard";
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setShowAlert(true);
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
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Insira seu e-mail e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Entrar"}
          </Button>
        </CardFooter>
        <div
          className="mt-4 text-center text-sm"
        >
          <span className="text-gray-400">Não tem uma conta?</span>{" "}
          <Link href="/Register">
            <Button
              variant="link"
              className="font-medium underline-offset-4 hover:underline text-white mb-4"
            >
              Registrar
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

