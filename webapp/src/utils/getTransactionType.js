function getTransactionType(transaction) {
  const { credit, debit } = transaction;

  if (credit) {
    return "credit";
  }

  if (debit) {
    return "debit";
  }

  return "cash";
}

export default getTransactionType;
