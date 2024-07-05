import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
import { Alert } from "./ui/alert";

export default function TransferHistory() {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const fetchTransfers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:1000/api/getTransfers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Transfers received:", response.data);  // Verifique os dados recebidos
        setTransfers(response.data);
      } catch (error) {
        console.error("Error fetching transfers:", error);
        setError("Erro ao obter transferências. " + (error.response?.data?.message || error.message));
        setShowAlert(true);
      }
    };
    fetchTransfers();
  }, []);

  useEffect(() => {
    if (showAlert) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setTimeout(() => {
          setShowAlert(false);
          setError("");
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
      {showAlert && (
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-center text-white transition-opacity duration-300 ease-in-out ${
            alertVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <h1 className="text-xl mb-4">Histórico de Transferências</h1>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Quantia</TableHead>
            <TableHead>Destinatário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer) => {
            // Confirmando que o valor de `amount` é um número antes de renderizar
            const amount = parseFloat(transfer.amount);
            if (isNaN(amount)) {
              console.error('Invalid amount data', transfer);
              return null; // Não renderiza a linha se o amount não é um número
            }
            return (
              <TableRow key={transfer.transactionid}>
                <TableCell>{new Date(transfer.date).toLocaleString()}</TableCell>
                <TableCell>{transfer.description}</TableCell>
                <TableCell>R$ {amount.toFixed(2)}</TableCell>
                <TableCell>{transfer.destinationUserName}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
