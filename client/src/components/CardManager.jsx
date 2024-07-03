import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const CardManager = () => {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [newCreditLimit, setNewCreditLimit] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:1000/api/getCards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao obter cartões:", error);
      }
    };
    fetchCards();
  }, []);

  const handleCreateCard = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:1000/api/createCard",
        { cardName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.reload();
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
    }
  };

  const handleUpgradeCard = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:1000/api/upgradeCard/${cardId}`,
        { newCreditLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.reload();
    } catch (error) {
      console.error("Erro ao fazer upgrade do cartão:", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:1000/api/deleteCard/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.reload();
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
    }
  };

  return (
    <div>
      <h2>Gerenciar Cartões</h2>
      <input
        type="text"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Nome do cartão"
      />
      <button onClick={handleCreateCard}>Criar Cartão</button>
      {cards.length === 0 ? (
        <p>Nenhum cartão encontrado. Crie seu primeiro cartão.</p>
      ) : (
        <div>
          {cards.map((card) => (
            <div key={card.id}>
              <p>{card.card_name}</p>
              <p>Saldo: R$ {card.balance}</p>
              <p>Limite de Crédito: R$ {card.credit_limit}</p>
              <input
                type="number"
                value={newCreditLimit}
                onChange={(e) => setNewCreditLimit(e.target.value)}
                placeholder="Novo limite de crédito"
              />
              <button onClick={() => handleUpgradeCard(card.id)}>Upgrade</button>
              <button onClick={() => handleDeleteCard(card.id)}>Excluir</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardManager;
