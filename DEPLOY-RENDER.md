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

### **Étape 3 : Configuration Discord**
Dans l'onglet **"Environment"** de votre service, ajoutez :

```env
DISCORD_BOT_TOKEN = votre_token_bot_discord
DISCORD_GUILD_ID = votre_id_serveur_discord
```

**Comment récupérer ces valeurs :**
- **TOKEN** : Discord Developer Portal → Votre app → Bot → Token
- **GUILD_ID** : Clic droit sur votre serveur Discord → "Copier l'ID"

### **Étape 4 : Base de données (Optionnel)**
Si vous avez des données FiveM à importer :
1. **Render Dashboard** → **"New +"** → **"PostgreSQL"**
2. **Plan Free** (1GB gratuit)
3. **Connectez à votre service** via les variables d'environnement

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
