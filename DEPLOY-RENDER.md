# 🚀 Déploiement Immédiat sur Render.com

## ⚡ **Déploiement en 3 minutes**

### **Étape 1 : Préparer GitHub**
1. **Créez un repo** sur GitHub : `fivem-discord-bot`
2. **Uploadez TOUS les fichiers** de ce dossier SAUF `.env`
3. **Vérifiez** que ces fichiers sont présents :
   - ✅ `render.yaml`
   - ✅ `package.json` 
   - ✅ `index.js`
   - ✅ Dossier `commands/`

### **Étape 2 : Déployer sur Render**
1. **Allez sur** https://render.com
2. **Connectez-vous avec GitHub**
3. **Cliquez "New +"** → **"Web Service"**
4. **Sélectionnez votre repo** `fivem-discord-bot`
5. **Render détecte automatiquement** le fichier `render.yaml`
6. **Cliquez "Create Web Service"**

### **Étape 3 : Configuration complète**
Dans l'onglet **"Environment"** de votre service, ajoutez TOUTES ces variables :

```env
# Discord
DISCORD_BOT_TOKEN = votre_token_bot_discord
DISCORD_GUILD_ID = votre_id_serveur_discord

# Base de données MySQL (votre hébergeur)
DB_HOST = 141.94.245.139
DB_USER = u3527_kGQVT8BKh2
DB_PASSWORD = G===ua0EiFf0.yq+RHxEjKF
DB_NAME = s3527_ArcadiaV1

# Rôles Discord (déjà configurés)
WHITELIST_ROLE_ID = 1351613530813497377
NON_WHITELIST_ROLE_ID = 1351651570265100430
MODERATOR_ROLE_ID = 1362514672829599947
ADMIN_ROLE_ID = 1351613530914164913,1351613530956103705,1351613530956103704
SUPPORT_ROLE_ID = 1351613530876678324

# Channels Discord (déjà configurés)
WL_ANNOUNCEMENT_CHANNEL_ID = 1351651405131157566
WL_CHANNEL_ID = 1351653410750861322
```

**Comment récupérer ces valeurs :**
- **TOKEN** : Discord Developer Portal → Votre app → Bot → Token
- **GUILD_ID** : Clic droit sur votre serveur Discord → "Copier l'ID"

**✅ Vos infos MySQL sont déjà remplies :**
- **DB_HOST** : 141.94.245.139 ✓
- **DB_USER** : u3527_kGQVT8BKh2 ✓
- **DB_PASSWORD** : G===ua0EiFf0.yq+RHxEjKF ✓
- **DB_NAME** : s3527_ArcadiaV1 ✓

**✅ Avantages de cette méthode :**
- Données FiveM en temps réel (compatible oxmysql)
- Pas de synchronisation nécessaire
- Économique (pas de base supplémentaire)
- Commandes bot toujours à jour

---

## ✅ **Résultat Final**

Votre bot sera accessible à :
- **URL** : `https://votre-app-name.onrender.com`
- **Status** : En ligne 24/7 sans sleep
- **Coût** : 0€/mois

## 🔧 **Monitoring**

Endpoints disponibles :
- **`/`** : Status du bot
- **`/health`** : Santé du service

## 🆘 **Dépannage Rapide**

**Bot ne démarre pas ?**
- Vérifiez les logs : Render Dashboard → Votre service → "Logs"
- Vérifiez le TOKEN Discord dans "Environment"

**Commandes ne marchent pas ?**
- Vérifiez les permissions du bot Discord
- Vérifiez les IDs des rôles/channels

---

**🎉 Votre bot FiveM est maintenant en ligne gratuitement ! 🚀**
