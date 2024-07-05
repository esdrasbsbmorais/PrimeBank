import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Select } from "./ui/select";
import { Alert } from "./ui/alert";

const CardManager = () => {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [recipientCardNumber, setRecipientCardNumber] = useState("");
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:1000/api/getCards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data);
        if (response.data.length > 0) {
          setSelectedCard(response.data[0]);
        }
      } catch (error) {
        setError("Erro ao obter cartões.");
        setShowAlert(true);
      }
    };
    fetchCards();
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

  const handleCreateCard = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:1000/api/createCard",
        { cardName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCards([...cards, response.data]);
      setSelectedCard(response.data);
    } catch (error) {
      setError("Erro ao criar cartão.");
      setShowAlert(true);
    }
  };

  const handleUpgradeCard = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:1000/api/upgradeCard/${cardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCard = response.data;
      setCards(
        cards.map((card) => (card.cardid === cardId ? updatedCard : card))
      );
      setSelectedCard(updatedCard);
    } catch (error) {
      setError("Erro ao fazer upgrade do cartão.");
      setShowAlert(true);
    }
  };

  const handleDowngradeCard = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:1000/api/downgradeCard/${cardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCard = response.data;
      setCards(
        cards.map((card) => (card.cardid === cardId ? updatedCard : card))
      );
      setSelectedCard(updatedCard);
    } catch (error) {
      setError("Erro ao fazer downgrade do cartão.");
      setShowAlert(true);
    }
  };

  const handleDeleteCard = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:1000/api/deleteCard/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(cards.filter((card) => card.cardid !== cardId));
      if (selectedCard.cardid === cardId) {
        setSelectedCard(cards.length > 1 ? cards[0] : null);
      }
    } catch (error) {
      setError("Erro ao excluir cartão.");
      setShowAlert(true);
    }
  };

  const handleSelectCard = (e) => {
    const cardId = parseInt(e.target.value);
    const selected = cards.find((card) => card.cardid === cardId);
    setSelectedCard(selected);
  };

  const getCardStyle = (cardType) => {
    switch (cardType) {
      case "Basic":
        return "bg-gray-500 text-white";
      case "Intermediate":
        return "bg-yellow-500 text-white";
      case "Elite":
        return "bg-black text-yellow-500";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCardName = (cardType) => {
    switch (cardType) {
      case "Basic":
        return "Basic Cash Back";
      case "Intermediate":
        return "Intermediate Rewards";
      case "Elite":
        return "Elite Travel";
      default:
        return "Unknown Card Type";
    }
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(selectedCard.cardnumber);
    console.log("Número do cartão copiado!");
  };

  const handleFindRecipient = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:1000/api/findUserByCard/${recipientCardNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipientDetails(response.data);
    } catch (error) {
      setError("Erro ao buscar destinatário.");
      setShowAlert(true);
    }
  };

  const handleTransfer = async () => {
    if (!selectedCard || !recipientDetails || !transferAmount) {
      setError("Por favor, preencha todos os campos.");
      setShowAlert(true);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:1000/api/transactions",
        {
          sourceUserId: selectedCard.userid,
          destinationUserId: recipientDetails.id,
          amount: parseFloat(transferAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Transferência realizada com sucesso!");
    } catch (error) {
      setError("Erro ao realizar transferência.");
      setShowAlert(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {showAlert && (
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-center text-white transition-opacity duration-300 ease-in-out ${
            alertVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-lg my-2">
            Nenhum cartão encontrado. Crie seu primeiro cartão.
          </p>
          <FontAwesomeIcon
            icon={faPlusCircle}
            className="h-10 w-10 text-yellow-500 cursor-pointer"
            onClick={handleCreateCard}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {cards.length > 1 && (
            <Select
              className="mb-4"
              value={selectedCard ? selectedCard.cardid : ""}
              onChange={handleSelectCard}
            >
              <option value="">Selecione um cartão</option>
              {cards.map((card, index) => (
                <option
                  key={card.cardid ? `card-${card.cardid}` : `card-${index}`}
                  value={card.cardid}
                >
                  {getCardName(card.cardtype)} - **** **** ****{" "}
                  {card.cardnumber ? card.cardnumber.slice(-4) : "XXXX"}
                </option>
              ))}
            </Select>
          )}
          {selectedCard && (
            <Card
              className={`mt-8 w-full md:w-96 h-auto rounded-lg p-4 shadow-lg ${getCardStyle(
                selectedCard.cardtype
              )}`}
            >
              <div>
                <p className="text-2xl font-bold pb-5">
                  {getCardName(selectedCard.cardtype)}
                </p>
                <div className="flex items-center">
                  <p className="mr-2">Número: {selectedCard.cardnumber}</p>
                  <FontAwesomeIcon
                    icon={faCopy}
                    className="cursor-pointer"
                    onClick={handleCopyCardNumber}
                  />
                </div>
                <p>Limite de Crédito: R$ {selectedCard.spendinglimit}</p>
              </div>
            </Card>
          )}
          {selectedCard && (
            <div className="flex justify-between items-center mt-4 space-x-2">
              <Button
                onClick={() => handleUpgradeCard(selectedCard.cardid)}
                variant="success"
              >
                Upgrade
              </Button>
              <Button
                onClick={() => handleDowngradeCard(selectedCard.cardid)}
                variant="warning"
              >
                Downgrade
              </Button>
              <Button
                onClick={() => handleDeleteCard(selectedCard.cardid)}
                variant="danger"
              >
                Excluir
              </Button>
            </div>
          )}
          <div className="mt-4 w-full">
            <h2 className="text-lg mb-2">Transferir Dinheiro</h2>
            <div className="flex flex-col mb-2">
              <label htmlFor="recipientCardNumber">
                Número do Cartão do Destinatário
              </label>
              <input
                id="recipientCardNumber"
                type="text"
                className="border rounded px-4 py-2 mb-2 text-white bg-[#1a1a1c]"
                value={recipientCardNumber}
                onChange={(e) => setRecipientCardNumber(e.target.value)}
              />
              <Button onClick={handleFindRecipient}>Buscar Destinatário</Button>
            </div>
            {recipientDetails && (
              <div className="mb-4 mt-4">
                <p className="mb-2">Destinatário: {recipientDetails.name}</p>
                <label htmlFor="transferAmount" className="block mb-1">
                  Quantia
                </label>
                <input
                  id="transferAmount"
                  type="number"
                  className="border rounded px-4 py-2 mb-2 bg-[#1a1a1c] text-white w-full"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
                <Button className="w-full"
                  onClick={handleTransfer}
                >
                  Transferir
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardManager;
