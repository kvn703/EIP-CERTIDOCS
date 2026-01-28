/**
 * Utilitaire pour gérer l'annuaire d'adresses dans localStorage
 */

const STORAGE_KEY = 'certidocs_address_directory';

/**
 * Normalise une adresse Ethereum (met en minuscules, ajoute 0x si nécessaire)
 */
export const normalizeAddress = (address) => {
  if (!address) return '';
  let normalized = address.trim();
  if (!normalized.startsWith('0x')) {
    normalized = '0x' + normalized;
  }
  return normalized.toLowerCase();
};

/**
 * Récupère toutes les entrées de l'annuaire
 */
export const getAddressDirectory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annuaire:', error);
    return [];
  }
};

/**
 * Sauvegarde l'annuaire dans localStorage
 */
export const saveAddressDirectory = (directory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(directory));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'annuaire:', error);
    return false;
  }
};

/**
 * Ajoute une nouvelle entrée à l'annuaire
 */
export const addAddressToDirectory = (address, label) => {
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedAddress || normalizedAddress.length < 42) {
    return { success: false, error: 'Adresse invalide' };
  }

  const directory = getAddressDirectory();
  
  // Vérifier si l'adresse existe déjà
  const exists = directory.some(entry => normalizeAddress(entry.address) === normalizedAddress);
  if (exists) {
    return { success: false, error: 'Cette adresse existe déjà dans l\'annuaire' };
  }

  // Ajouter la nouvelle entrée
  const newEntry = {
    address: normalizedAddress,
    label: label.trim() || `Adresse ${directory.length + 1}`,
    createdAt: new Date().toISOString()
  };

  directory.push(newEntry);
  const saved = saveAddressDirectory(directory);
  
  return saved 
    ? { success: true, entry: newEntry }
    : { success: false, error: 'Erreur lors de la sauvegarde' };
};

/**
 * Supprime une entrée de l'annuaire
 */
export const removeAddressFromDirectory = (address) => {
  const normalizedAddress = normalizeAddress(address);
  const directory = getAddressDirectory();
  const filtered = directory.filter(entry => normalizeAddress(entry.address) !== normalizedAddress);
  return saveAddressDirectory(filtered);
};

/**
 * Recherche dans l'annuaire par label ou adresse
 */
export const searchAddressDirectory = (query) => {
  if (!query || query.trim() === '') {
    return getAddressDirectory();
  }

  const searchTerm = query.toLowerCase().trim();
  const directory = getAddressDirectory();
  
  return directory.filter(entry => {
    const labelMatch = entry.label.toLowerCase().includes(searchTerm);
    const addressMatch = entry.address.toLowerCase().includes(searchTerm);
    return labelMatch || addressMatch;
  });
};

/**
 * Vérifie si une adresse existe dans l'annuaire
 */
export const isAddressInDirectory = (address) => {
  const normalizedAddress = normalizeAddress(address);
  const directory = getAddressDirectory();
  return directory.some(entry => normalizeAddress(entry.address) === normalizedAddress);
};

/**
 * Récupère le label d'une adresse si elle existe dans l'annuaire
 */
export const getAddressLabel = (address) => {
  const normalizedAddress = normalizeAddress(address);
  const directory = getAddressDirectory();
  const entry = directory.find(entry => normalizeAddress(entry.address) === normalizedAddress);
  return entry ? entry.label : null;
};

/**
 * Vérifie si un label existe déjà dans l'annuaire
 */
export const isLabelInDirectory = (label) => {
  if (!label || !label.trim()) return false;
  const directory = getAddressDirectory();
  const labelToCheck = label.trim().toLowerCase();
  return directory.some(entry => entry.label.toLowerCase() === labelToCheck);
};
