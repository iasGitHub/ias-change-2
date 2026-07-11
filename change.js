
    // ============================================================
    //  VÉRIFICATION DE LA CONFIGURATION
    // ============================================================



    // ============================================================
    //  CONFIGURATION - UTILISATION DES VARIABLES EXTERNES
    // ============================================================

    const {
      ADMIN_PASSWORD,
      DEFAULT_TAUX,
      TELEPHONE,
      MOYENS_PAIEMENT,
      MONTANTS_CFA
    } = CONFIG;

    const STORAGE_KEY = 'iasChange_taux';
    const ADMIN_KEY = 'iasChange_admin_visible';

    // ============================================================
    //  ÉTAT DE L'APPLICATION
    // ============================================================

    let modeInverse = false;
    let adminVisible = false;

    // ============================================================
    //  GESTION DU TAUX
    // ============================================================

    function getTaux() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const val = parseFloat(stored);
        if (!isNaN(val) && val > 0) return val;
      }
      return DEFAULT_TAUX;
    }

    function setTaux(val) {
      if (val > 0) {
        localStorage.setItem(STORAGE_KEY, val.toString());
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // ============================================================
    //  GESTION DE L'ADMIN
    // ============================================================

    function openAdminModal() {
      document.getElementById('modalPassword').classList.add('visible');
      document.getElementById('inputPassword').value = '';
      document.getElementById('erreurPassword').classList.remove('visible');
      document.getElementById('inputPassword').focus();
    }

    function closeAdminModal() {
      document.getElementById('modalPassword').classList.remove('visible');
    }

    function toggleAdmin() {
      if (adminVisible) {
        adminVisible = false;
        document.getElementById('adminPanel').classList.remove('visible');
        document.getElementById('adminBadge').classList.remove('visible');
        localStorage.removeItem(ADMIN_KEY);
      } else {
        openAdminModal();
      }
    }

    function validatePassword() {
      const input = document.getElementById('inputPassword');
      const erreur = document.getElementById('erreurPassword');

      if (input.value === ADMIN_PASSWORD) {
        adminVisible = true;
        document.getElementById('adminPanel').classList.add('visible');
        document.getElementById('adminBadge').classList.add('visible');
        document.getElementById('tauxInput').value = getTaux();
        localStorage.setItem(ADMIN_KEY, 'true');
        closeAdminModal();
      } else {
        erreur.classList.add('visible');
        input.value = '';
        input.focus();
      }
    }

    function checkAdminState() {
      if (localStorage.getItem(ADMIN_KEY) === 'true') {
        adminVisible = true;
        document.getElementById('adminPanel').classList.add('visible');
        document.getElementById('adminBadge').classList.add('visible');
        document.getElementById('tauxInput').value = getTaux();
      }
    }

    // ============================================================
    //  GÉNÉRATION DU CONTENU DYNAMIQUE
    // ============================================================

    function genererMoyensPaiement() {
      const container = document.getElementById('paiementContainer');
      container.innerHTML = MOYENS_PAIEMENT.map(mp => `
        <div class="paiement-item">
          <img src="https://via.placeholder.com/32/006400/ffd700?text=${mp.icone}" alt="${mp.nom}" />
          ${mp.nom}
        </div>
      `).join('');
    }

    function genererTelephone() {
      const telElement = document.getElementById('telDisplay');
      telElement.innerHTML = `
        📞 ${TELEPHONE}
        <small>Appels &amp; WhatsApp</small>
      `;
    }

    // ============================================================
    //  MISE À JOUR DE L'INTERFACE
    // ============================================================

    function updateAll() {
      const taux = getTaux();

      // Mettre à jour l'affichage du taux
      document.getElementById('tauxDisplay').textContent = `1 CFA = ${taux.toFixed(3)} MRO`;

      // Mettre à jour le tableau des prix
      const tableau = document.getElementById('tableauPrix');
      tableau.innerHTML = MONTANTS_CFA.map(cfa => {
        const mro = (cfa * taux).toFixed(0);
        return `<div class="ligne">
                  <span>${cfa.toLocaleString()} F CFA</span>
                  <span>${parseInt(mro).toLocaleString()} MRO</span>
                </div>`;
      }).join('');

      // ✅ FORCER le calcul avec la valeur actuelle du champ
      calculer();
    }

    // ============================================================
    //  CALCULATEUR (CORRIGÉ)
    // ============================================================

    function calculer() {
      const input = document.getElementById('inputMontant');
      const resultat = document.getElementById('resultatConversion');
      const taux = getTaux();

      // ✅ Convertir correctement la valeur en nombre
      let val = parseFloat(input.value);
      
      // ✅ Si la valeur est invalide ou vide, utiliser 0
      if (isNaN(val) || val < 0) {
        val = 0;
        input.value = 0;
      }

      let result;
      let fromDevise, toDevise;

      if (modeInverse) {
        // Mode MRO -> CFA
        result = val / taux;
        fromDevise = 'MRO';
        toDevise = 'CFA';
        document.getElementById('labelCalcul').textContent = '💸 Entrez un montant en Ouguiya (MRO)';
      } else {
        // Mode CFA -> MRO
        result = val * taux;
        fromDevise = 'CFA';
        toDevise = 'MRO';
        document.getElementById('labelCalcul').textContent = '💸 Entrez un montant en CFA';
      }

      document.getElementById('deviseFrom').textContent = fromDevise;
      
      // ✅ Afficher le résultat correctement formaté
      if (val === 0) {
        resultat.textContent = `0 ${toDevise}`;
      } else {
        resultat.textContent = `${Math.round(result).toLocaleString()} ${toDevise}`;
      }
    }

    // ============================================================
    //  INVERSER
    // ============================================================

    function inverserMode() {
      modeInverse = !modeInverse;
      document.getElementById('btnInverser').textContent = modeInverse 
        ? '🔄 Convertir CFA → MRO' 
        : '🔄 Convertir MRO → CFA';
      
      // ✅ Conserver la valeur actuelle et recalculer
      calculer();
    }

    // ============================================================
    //  ÉVÉNEMENTS
    // ============================================================

    // Double-clic sur le titre → demande mot de passe
    document.getElementById('titrePrincipal').addEventListener('dblclick', toggleAdmin);

    // Confirmer le mot de passe
    document.getElementById('btnConfirmPassword').addEventListener('click', validatePassword);

    // Annuler
    document.getElementById('btnCancelPassword').addEventListener('click', closeAdminModal);

    // Touche Entrée dans le champ mot de passe
    document.getElementById('inputPassword').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        validatePassword();
      }
    });

    // Fermer la modal en cliquant sur l'overlay
    document.getElementById('modalPassword').addEventListener('click', function(e) {
      if (e.target === this) {
        closeAdminModal();
      }
    });

    // ✅ Calcul en temps réel (amélioré)
    document.getElementById('inputMontant').addEventListener('input', function() {
      // Nettoyer la valeur
      let val = parseFloat(this.value);
      if (isNaN(val) || val < 0) {
        val = 0;
      }
      this.value = val;
      calculer();
    });

    // ✅ Inverser
    document.getElementById('btnInverser').addEventListener('click', inverserMode);

    // ✅ Mise à jour du taux
    document.getElementById('btnUpdate').addEventListener('click', function() {
      const input = document.getElementById('tauxInput');
      let val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) {
        alert('Veuillez entrer un taux valide (ex: 0.74)');
        return;
      }
      setTaux(val);
      updateAll();
      document.getElementById('tauxInput').value = val;
    });

    // ✅ Réinitialiser
    document.getElementById('btnReset').addEventListener('click', function() {
      if (confirm('Réinitialiser le taux à la valeur par défaut ?')) {
        setTaux(DEFAULT_TAUX);
        updateAll();
        document.getElementById('tauxInput').value = DEFAULT_TAUX;
      }
    });

    // Touche Entrée dans le champ taux
    document.getElementById('tauxInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('btnUpdate').click();
      }
    });

    // ============================================================
    //  INITIALISATION
    // ============================================================

    // Générer le contenu dynamique
    genererMoyensPaiement();
    genererTelephone();
    
    // Restaurer l'état de l'admin
    checkAdminState();
    
    // ✅ Initialiser l'interface avec la valeur par défaut
    updateAll();

    console.log('💱 iasChange - Configuration chargée');
    console.log('📞 Téléphone :', TELEPHONE);
    console.log('💰 Taux par défaut :', DEFAULT_TAUX);
    console.log('📝 Moyens de paiement :', MOYENS_PAIEMENT.map(m => m.nom).join(', '));
    console.log('🔑 Double-cliquez sur le titre pour accéder à l\'admin');