import pool from "../config/db.js";

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      verification_token VARCHAR(255),
      reset_token VARCHAR(255),
      token_expiry TIMESTAMP
    );
  `;
  await pool.query(query);
};

const createCardTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Cards (
      CardId SERIAL PRIMARY KEY,
      UserId INT NOT NULL REFERENCES Users(id),
      CardNumber VARCHAR(255) NOT NULL,
      SpendingLimit DECIMAL(10, 2) NOT NULL,
      ExpiryDate DATE NOT NULL,
      CardType VARCHAR(50) NOT NULL,
      IssueDate DATE NOT NULL,
      Blocked BOOLEAN NOT NULL
    );
  `;
  await pool.query(query);
};

const createTransactionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Transactions (
      TransactionId SERIAL PRIMARY KEY,
      SourceUserId INT NOT NULL REFERENCES Users(id),
      DestinationUserId INT NOT NULL REFERENCES Users(id),
      Amount DECIMAL(10, 2) NOT NULL,
      Date TIMESTAMP NOT NULL,
      Description VARCHAR(255)
    );
  `;
  await pool.query(query);
};

const createTables = async () => {
  try {
    await createUserTable();
    await createCardTable();
    await createTransactionTable();
    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error);
  } finally {
    pool.end();
  }
};

createTables();
