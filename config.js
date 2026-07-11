// ============================================================
//  CONFIGURATION CONFIDENTIELLE - iasChange
//  ⚠️ À GARDER SECRET - NE PAS PARTAGER CE FICHIER
// ============================================================

const CONFIG = {
  // 🔑 Mot de passe administrateur
  ADMIN_PASSWORD: "admin123",  // CHANGEZ-MOI !
  
  // 💰 Taux de change par défaut (1 CFA en MRO)
  DEFAULT_TAUX: 0.74,
  
  // 📱 Numéro de téléphone
  TELEPHONE: "49 56 14 86",
  
  // 💳 Moyens de paiement
  MOYENS_PAIEMENT: [
    { nom: "Bankily", icone: "B" },
    { nom: "Masrvi", icone: "M" },
    { nom: "Seddad", icone: "S" }
  ],
  
  // 💵 Montants CFA affichés dans le tableau
  MONTANTS_CFA: [5000, 10000, 15000, 20000, 30000, 50000, 100000],
  
  // 🎨 Couleurs du thème
  THEME: {
    primary: "#0b5e0b",
    secondary: "#e6b800",
    accent: "#ffd700",
    dark: "#1a3a1a"
  }
};
