# 🚀 Guide Complet - Déploiement Render.com GRATUIT

## 🎯 **Pourquoi Render.com ?**
- ✅ **100% GRATUIT** - Pas de carte bancaire requise
- ✅ **750 heures/mois** gratuites (plus que Heroku)
- ✅ **Base de données PostgreSQL gratuite** (1GB)
- ✅ **Pas de sleep automatique**
- ✅ **SSL automatique**
- ✅ **Déploiement Git automatique**

---

## 📋 **Prérequis**
- Compte GitHub (gratuit)
- Compte Render.com (gratuit)
- Votre bot Discord configuré

---

## 🎯 **ÉTAPE 1 : Créer un compte Render.com**

1. **Allez sur** https://render.com
2. **Cliquez "Get Started"**
3. **Connectez-vous avec GitHub** (recommandé)
4. **Autorisez Render** à accéder à vos repos

---

## 🎯 **ÉTAPE 2 : Préparer votre repository GitHub**

### **2.1 Créer/Mettre à jour votre repo**
1. Sur GitHub, créez un nouveau repo : `fivem-discord-bot`
2. Uploadez TOUS les fichiers de votre projet SAUF `.env`
3. Assurez-vous que `render.yaml` est inclus

### **2.2 Vérifier les fichiers essentiels**
Votre repo doit contenir :
- ✅ `package.json`
- ✅ `index.js`
- ✅ `render.yaml` (créé automatiquement)
- ✅ `.gitignore` (avec `.env` dedans)
- ❌ `.env` (NE PAS inclure)

---

## 🎯 **ÉTAPE 3 : Déployer sur Render**

### **3.1 Créer un nouveau service**
1. **Dashboard Render** → Cliquez "New +"
2. **Sélectionnez "Web Service"**
3. **Connectez votre repo GitHub** `fivem-discord-bot`
4. **Cliquez "Connect"**

### **3.2 Configuration automatique**
Render détectera automatiquement le fichier `render.yaml` et configurera :
- ✅ **Environment** : Node.js
- ✅ **Build Command** : `npm install`
- ✅ **Start Command** : `node index.js`
- ✅ **Plan** : Free

### **3.3 Variables d'environnement**
Render pré-remplira les variables depuis `render.yaml`. Vous devez juste ajouter :

```
DISCORD_BOT_TOKEN = votre_token_bot_ici
DISCORD_GUILD_ID = votre_id_serveur_ici
DB_HOST = (sera configuré automatiquement avec la base)
DB_USER = (sera configuré automatiquement avec la base)
DB_PASSWORD = (sera configuré automatiquement avec la base)
DB_NAME = (sera configuré automatiquement avec la base)
```

---

## 🎯 **ÉTAPE 4 : Base de données gratuite**

### **4.1 Créer une base PostgreSQL**
1. **Dashboard Render** → Cliquez "New +"
2. **Sélectionnez "PostgreSQL"**
3. **Nom** : `fivem-bot-db`
4. **Plan** : Free (1GB)
5. **Cliquez "Create Database"**

### **4.2 Récupérer les infos de connexion**
1. **Cliquez sur votre base** créée
2. **Section "Connections"**
3. **Copiez** :
   - **Hostname**
   - **Username** 
   - **Password**
   - **Database**

### **4.3 Ajouter à votre service**
1. **Retournez à votre Web Service**
2. **Onglet "Environment"**
3. **Ajoutez les variables DB_***

---

## 🎯 **ÉTAPE 5 : Déploiement final**

### **5.1 Lancer le déploiement**
1. **Cliquez "Create Web Service"**
2. **Render va** :
   - Cloner votre repo
   - Installer les dépendances
   - Démarrer votre bot
3. **Attendez 2-3 minutes**

### **5.2 Vérifier le statut**
1. **Onglet "Logs"** → Vous devriez voir :
   ```
   Bot connecté en tant que VotreBot#1234
   ```
2. **Onglet "Events"** → Status "Live"

---

## 🎯 **ÉTAPE 6 : Configuration Discord**

### **6.1 Récupérer l'URL de votre service**
1. **Votre service Render** aura une URL comme :
   ```
   https://fivem-discord-bot-xxxx.onrender.com
   ```

### **6.2 Garder le bot actif (optionnel)**
Pour éviter que le bot se mette en veille :
1. **Utilisez UptimeRobot** (gratuit)
2. **Pingez votre URL** toutes les 5 minutes
3. **Ou ajoutez un endpoint de santé** dans votre code

---

## 🎯 **ÉTAPE 7 : Migration des données**

### **7.1 Exporter depuis MySQL**
```sql
-- Exportez vos tables FiveM
mysqldump -u root -p essentialmode users > users.sql
mysqldump -u root -p essentialmode owned_vehicles > vehicles.sql
```

### **7.2 Convertir pour PostgreSQL**
Utilisez un outil comme **pgloader** ou modifiez manuellement :
```sql
-- Adaptez les types de données MySQL → PostgreSQL
-- INT → INTEGER
-- VARCHAR → TEXT
-- etc.
```

### **7.3 Importer vers Render PostgreSQL**
```bash
# Connectez-vous à votre base Render
psql postgresql://username:password@hostname:port/database

# Importez vos données
\i users.sql
\i vehicles.sql
```

---

## 🎯 **ÉTAPE 8 : Automatisation GitHub**

### **8.1 Auto-déploiement**
1. **Render détecte automatiquement** les push sur votre repo
2. **Chaque commit** déclenche un nouveau déploiement
3. **Pas de configuration supplémentaire** nécessaire

### **8.2 Branches**
- **main/master** → Déploiement automatique
- **dev** → Créez un service séparé pour les tests

---

## 🚨 **Avantages Render vs Heroku**

| Fonctionnalité | Render (Gratuit) | Heroku (Gratuit) |
|----------------|------------------|------------------|
| **Heures/mois** | 750h | 550h |
| **Sleep automatique** | ❌ Non | ✅ Oui (30min) |
| **Base de données** | PostgreSQL 1GB | Addon requis |
| **SSL** | ✅ Automatique | ✅ Automatique |
| **Domaine custom** | ✅ Gratuit | ❌ Payant |
| **Build time** | Plus rapide | Plus lent |

---

## 🔧 **Dépannage**

### **Bot ne démarre pas**
1. **Vérifiez les logs** : Onglet "Logs"
2. **Variables manquantes** : Onglet "Environment"
3. **Erreur de build** : Vérifiez `package.json`

### **Erreur base de données**
1. **Vérifiez la connexion** PostgreSQL
2. **Variables DB_*** correctes
3. **Tables créées** dans la base

### **Bot se déconnecte**
1. **Ajoutez UptimeRobot** pour le ping
2. **Vérifiez les limites** du plan gratuit
3. **Optimisez le code** (moins de logs)

---

## 📱 **Monitoring**

### **Dashboard Render**
- **Métriques** : CPU, RAM, Réseau
- **Logs en temps réel**
- **Alertes par email**

### **Outils externes**
- **UptimeRobot** : Monitoring uptime
- **Discord Webhooks** : Notifications
- **GitHub Actions** : Tests automatiques

---

## 🎉 **Récapitulatif**

✅ **Compte Render créé**  
✅ **Repository GitHub connecté**  
✅ **Service Web configuré**  
✅ **Base PostgreSQL créée**  
✅ **Variables d'environnement définies**  
✅ **Bot déployé et en ligne 24/7**  
✅ **Auto-déploiement activé**

---

## 💡 **Conseils Pro**

1. **Surveillez vos ressources** : Dashboard Render
2. **Utilisez les logs** pour déboguer
3. **Sauvegardez régulièrement** votre base
4. **Testez en local** avant de push
5. **Utilisez des branches** pour les features

**Votre bot Discord FiveM est maintenant hébergé GRATUITEMENT sur Render.com ! 🚀**

---

## 🔗 **Liens Utiles**

- **Render.com** : https://render.com
- **Documentation** : https://render.com/docs
- **Support** : https://render.com/support
- **Status** : https://status.render.com
