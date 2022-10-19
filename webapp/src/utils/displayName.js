export default function dipslayName(name, deleted) {
  if (deleted) {
    return name + " (Deleted)";
  }

  return name;
}
