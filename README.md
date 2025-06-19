# 🪙 Algorand Token Creator

Webowa aplikacja do tworzenia własnych tokenów ASA (Algorand Standard Assets) z wykorzystaniem Pera Wallet i opłatą w ALGO za niestandardowe opcje.

## ✨ Funkcje

- Tworzenie tokenów ASA na testnecie Algorand
- Opcjonalne dodanie logo (URL)
- Możliwość zablokowania podaży (brak możliwości mintowania)
- Dynamiczna opłata (10 ALGO za podstawę, +10 ALGO za każdą opcję)
- Połączenie z portfelem użytkownika przez Pera Wallet Connect
- Frontend w React + Tailwind CSS + Vite

## 💸 Zasady opłat

| Opcja                      | Koszt  |
|---------------------------|--------|
| Utworzenie tokena         | 10 ALGO |
| Dodanie logo (URL)        | +10 ALGO |
| Zablokowanie podaży       | +10 ALGO |
| **Maks. łączny koszt**    | **30 ALGO** |

Opłata przesyłana jest na adres właściciela aplikacji przed wygenerowaniem tokena.

## 🚀 Uruchomienie lokalne

```bash
git clone https://github.com/bartsko/algorand-token-creator.git
cd algorand-token-creator
npm install
npm run dev
