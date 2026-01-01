# 🐘 Guide PostgreSQL pour Bot Discord FiveM

## 🎯 **Pourquoi PostgreSQL ?**
- ✅ **Gratuit** sur Render (1GB)
- ✅ **Accès distant** autorisé par défaut
- ✅ **Pas de configuration** d'IP nécessaire
- ✅ **Plus rapide** que MySQL distant
- ✅ **Intégration native** avec Render

---

## 📋 **Étape 1 : Créer la base PostgreSQL**

### **1.1 Sur Render Dashboard**
1. Allez sur https://render.com
2. **Cliquez "New +"** → **"PostgreSQL"**
3. **Nom** : `fivem-bot-database`
4. **Plan** : **Free** (1GB gratuit)
5. **Cliquez "Create Database"**

### **1.2 Récupérer les informations de connexion**
Une fois créée, notez ces informations :
- **Host** : `dpg-xxxxx-a.oregon-postgres.render.com`
- **Database** : `fivem_bot_database_xxxx`
- **Username** : `fivem_bot_database_xxxx_user`
- **Password** : `xxxxxxxxxxxxxxxxx`
- **Port** : `5432`

---

## 📤 **Étape 2 : Exporter vos données MySQL**

### **2.1 Dans phpMyAdmin**
1. **Sélectionnez** votre base `s3527_ArcadiaV1`
2. **Cliquez "Exporter"** (onglet du haut)
3. **Méthode** : Personnalisée
4. **Format** : SQL
5. **Options importantes** :
   - ✅ Structure et données
   - ✅ Ajouter DROP TABLE
   - ✅ Ajouter CREATE TABLE
6. **Cliquez "Exécuter"**
7. **Téléchargez** le fichier `.sql`

### **2.2 Tables importantes à exporter**
Assurez-vous d'avoir ces tables :
- `users` (joueurs FiveM)
- `owned_vehicles` (véhicules)
- `fuel_stations` (stations essence)
- Autres tables de votre serveur FiveM

---

## 🔄 **Étape 3 : Convertir MySQL → PostgreSQL**

### **3.1 Modifications nécessaires**
Le fichier SQL MySQL doit être adapté pour PostgreSQL :

**Remplacements à faire :**
```sql
-- MySQL → PostgreSQL
`nom_colonne` → "nom_colonne"
AUTO_INCREMENT → SERIAL
LONGTEXT → TEXT
TINYINT(1) → BOOLEAN
ENGINE=InnoDB → (supprimer)
```

### **3.2 Outil de conversion (optionnel)**
Utilisez un convertisseur en ligne :
- https://www.sqlines.com/online
- Collez votre SQL MySQL
- Convertissez en PostgreSQL

---

## 💾 **Étape 4 : Importer dans PostgreSQL**

### **4.1 Via pgAdmin (recommandé)**
1. **Téléchargez pgAdmin** : https://www.pgadmin.org/
2. **Connectez-vous** avec vos infos Render
3. **Clic droit** sur votre base → **"Query Tool"**
4. **Collez** votre SQL converti
5. **Exécutez** (F5)

### **4.2 Via ligne de commande**
```bash
psql -h dpg-xxxxx-a.oregon-postgres.render.com -U username -d database_name -f votre_fichier.sql
```

---

## 🔧 **Étape 5 : Modifier le code du bot**

### **5.1 Installer pg au lieu de mysql2**
Dans `package.json`, remplacez :
```json
"mysql2": "^3.6.0"
```
par :
```json
"pg": "^8.11.0"
```

### **5.2 Modifier la configuration de base**
Dans `index.js` et `commands/admin.js`, remplacez :
```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function createDbConnection() {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
}
```

par :
```javascript
const { Client } = require('pg');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
};

async function createDbConnection() {
    const client = new Client(dbConfig);
    await client.connect();
    return client;
}
```

### **5.3 Adapter les requêtes SQL**
PostgreSQL utilise `$1, $2, $3` au lieu de `?` :
```javascript
// MySQL
const [rows] = await connection.execute('SELECT * FROM users WHERE identifier = ?', [id]);

// PostgreSQL
const result = await client.query('SELECT * FROM users WHERE identifier = $1', [id]);
const rows = result.rows;
```

---

## ⚙️ **Étape 6 : Variables d'environnement**

### **6.1 Sur Render (Environment)**
Remplacez vos variables MySQL par PostgreSQL :
```env
# PostgreSQL (Render)
DB_HOST = dpg-xxxxx-a.oregon-postgres.render.com
DB_USER = fivem_bot_database_xxxx_user
DB_PASSWORD = xxxxxxxxxxxxxxxxx
DB_NAME = fivem_bot_database_xxxx
DB_PORT = 5432

# Discord (inchangé)
DISCORD_BOT_TOKEN = votre_token_bot_discord
DISCORD_GUILD_ID = votre_id_serveur_discord

# Rôles Discord (inchangé)
WHITELIST_ROLE_ID = 1351613530813497377
NON_WHITELIST_ROLE_ID = 1351651570265100430
MODERATOR_ROLE_ID = 1362514672829599947
ADMIN_ROLE_ID = 1351613530914164913,1351613530956103705,1351613530956103704
SUPPORT_ROLE_ID = 1351613530876678324

# Channels Discord (inchangé)
WL_ANNOUNCEMENT_CHANNEL_ID = 1351651405131157566
WL_CHANNEL_ID = 1351653410750861322
```

---

## 🚀 **Étape 7 : Déploiement**

### **7.1 Mettre à jour le code**
1. **Commitez** les modifications sur GitHub
2. **Render** redéploiera automatiquement

### **7.2 Vérification**
1. **Logs Render** → Vérifiez qu'il n'y a pas d'erreurs
2. **Testez** une commande : `/search`
3. **Vérifiez** la connexion à la base

---

## ✅ **Avantages de cette solution**

- 🚀 **Performance** : PostgreSQL est plus rapide pour les requêtes complexes
- 🔒 **Sécurité** : Connexion SSL native
- 💰 **Gratuit** : 1GB gratuit sur Render
- 🔧 **Maintenance** : Pas de configuration d'IP
- 📊 **Monitoring** : Interface Render intégrée

---

## 🆘 **Dépannage**

### **Erreur de connexion**
- Vérifiez les variables d'environnement
- Assurez-vous que `ssl: { rejectUnauthorized: false }` est présent

### **Erreur de syntaxe SQL**
- PostgreSQL est plus strict que MySQL
- Utilisez des guillemets doubles `"` pour les noms de colonnes

### **Données manquantes**
- Vérifiez que l'import s'est bien passé
- Utilisez pgAdmin pour explorer la base

---

**🎉 Votre bot Discord FiveM fonctionnera maintenant avec PostgreSQL !**
