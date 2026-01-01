# 🤖 Présentation du Bot Discord FiveM

## 📋 Vue d'ensemble

Ce bot Discord a été développé spécialement pour notre serveur FiveM. Il offre des outils d'administration et de gestion pour faciliter le travail du staff.

---

## 🎯 Commandes Disponibles (Sans Base de Données)

### 🛡️ **Gestion Whitelist**

#### `/openwl`
- **Description** : Ouvre la whitelist du serveur
- **Utilité** : Permet aux nouveaux joueurs de postuler
- **Permissions** : Staff uniquement
- **Usage** : `/openwl`
- **Actions** :
  - 🔓 Ouvre le salon texte WL
  - 🔊 Ouvre le salon vocal WL
  - 📢 Envoie "@everyone 🟢 **Les WL sont ON**"

#### `/closewl`
- **Description** : Ferme la whitelist du serveur
- **Utilité** : Empêche les nouvelles candidatures
- **Permissions** : Staff uniquement
- **Usage** : `/closewl`
- **Actions** :
  - 🔒 Ferme le salon texte WL
  - 🔇 Ferme le salon vocal WL
  - 📢 Envoie "@everyone 🔴 **Les WL sont OFF**"

#### `/setupwl`
- **Description** : Envoie le message d'information whitelist Acadia
- **Utilité** : Affiche les conditions WL et projets légaux/illégaux disponibles
- **Permissions** : Staff uniquement
- **Usage** : `/setupwl`
- **Contenu** : 
  - 🔮 Prochaine session de whitelist
  - ➜ Conditions pour passer sa WL
  - 🟢 Projets légaux (LSPD, EMS, Avocats)
  - 🟣 Projets illégaux (Asiatique, F4L, Vagos, Groupe libre)

#### `/wl @utilisateur`
- **Description** : Ajoute un utilisateur à la whitelist
- **Utilité** : Valide directement un joueur sans passer par la DB
- **Permissions** : Staff uniquement
- **Usage** : `/wl @NomUtilisateur`
- **Action** : 
  - ✅ Ajoute le rôle "Whitelist"
  - ❌ Retire le rôle "Non-Whitelist"

---

## 🚫 Commandes Nécessitant la Base de Données

*Ces commandes seront disponibles une fois la connexion DB configurée :*

### 🔍 **Recherche et Gestion Joueurs**

#### `/search [identifier]`
- **Description** : Recherche les infos d'un joueur
- **Utilité** : Consulter profil, argent, métier d'un joueur
- **Paramètre** : ID Discord ou nom du joueur

#### `/chars [identifier]`
- **Description** : Affiche tous les personnages d'un joueur
- **Utilité** : Voir les différents persos créés par un joueur
- **Paramètre** : ID Discord ou nom du joueur

### 🚗 **Gestion Véhicules & Stations**

#### `/listestation`
- **Description** : Affiche toutes les stations avec propriétaires
- **Utilité** : Voir qui possède quelles stations-service

#### `/locatevehicle [plaque]`
- **Description** : Localise un véhicule par sa plaque
- **Utilité** : Retrouver un véhicule perdu ou volé
- **Paramètre** : Plaque d'immatriculation

### ⚙️ **Administration Avancée**

#### `/setposition [id] [x] [y] [z]`
- **Description** : Déplace un joueur déconnecté
- **Utilité** : Sortir un joueur bloqué dans un mur/objet
- **Paramètres** : ID joueur + coordonnées X, Y, Z
- **Permissions** : Modérateur+

#### `/wipe [identifier]`
- **Description** : Wipe un joueur avec sauvegarde automatique
- **Utilité** : Reset complet d'un personnage (argent, métier, véhicules, etc.)
- **Sécurité** : Sauvegarde automatique dans `wipe_backups`
- **Permissions** : Modérateur+

---

## 🔐 Système de Permissions

### **Rôles Requis**
- **👑 Administrateur** : Toutes les commandes
- **🛡️ Modérateur** : Commandes de gestion (wipe, setposition)
- **👮 Staff** : Commandes de base (whitelist, recherche)

### **Sécurité**
- Vérification automatique des permissions
- Messages d'erreur si accès refusé
- Logs de toutes les actions importantes

---

## 🌐 Fonctionnalités Techniques

### **Serveur Web Intégré**
- **Endpoint** : `/health` - Vérification du statut
- **Endpoint** : `/` - Informations générales
- **Utilité** : Évite la mise en veille sur Render.com

### **Interface Moderne**
- **Embeds Discord** : Messages formatés et colorés
- **Réponses éphémères** : Messages privés pour les erreurs
- **Feedback visuel** : ✅ Succès, ❌ Erreurs, ⚠️ Avertissements

### **Gestion d'Erreurs**
- Connexion DB automatique avec retry
- Messages d'erreur clairs pour les utilisateurs
- Logs détaillés pour le debugging

---

## 📊 Avantages pour le Staff

### **⚡ Efficacité**
- Commandes slash rapides et intuitives
- Pas besoin de se connecter au serveur FiveM
- Actions directes depuis Discord

### **🔒 Sécurité**
- Système de permissions robuste
- Sauvegardes automatiques (wipe)
- Traçabilité des actions

### **🎨 Facilité d'Usage**
- Interface Discord familière
- Messages clairs et informatifs
- Aide contextuelle intégrée

---

## 🚀 Prochaines Étapes

1. **Configuration DB** : Connexion à la base de données FiveM
2. **Test des commandes** : Validation de toutes les fonctionnalités
3. **Formation staff** : Session de prise en main
4. **Monitoring** : Surveillance des performances

---

## 📞 Support

En cas de problème ou question :
- Vérifier les logs du bot
- Tester la commande `/health` 
- Contacter l'administrateur technique

**Le bot est prêt à faciliter votre travail de modération ! 🎉**
