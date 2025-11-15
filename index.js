const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'essentialmode'
};

// Collection pour stocker les commandes
client.commands = new Collection();

// Fonction pour créer une connexion à la base de données
async function createDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        return null;
    }
}

// Fonction utilitaire pour créer des embeds
function createEmbed(title, description, color = 0x0099FF) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// Fonction pour vérifier les permissions
function hasPermission(member, requiredRoles) {
    return requiredRoles.some(roleId => {
        // Si le roleId contient des virgules, c'est une liste de rôles
        if (roleId && roleId.includes(',')) {
            const roleIds = roleId.split(',');
            return roleIds.some(id => member.roles.cache.has(id.trim()));
        }
        return member.roles.cache.has(roleId);
    });
}

client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}!`);
    
    // Enregistrement des commandes slash
    const commands = [
        {
            name: 'wl',
            description: 'Ajouter un joueur à la whitelist',
            options: [{
                name: 'user',
                description: 'L\'utilisateur à whitelister',
                type: 6, // USER type
                required: true
            }]
        },
        {
            name: 'search',
            description: 'Rechercher les informations d\'un joueur',
            options: [{
                name: 'identifier',
                description: 'ID Discord ou nom du joueur',
                type: 3, // STRING type
                required: true
            }]
        },
        {
            name: 'chars',
            description: 'Afficher tous les personnages d\'un joueur',
            options: [{
                name: 'identifier',
                description: 'ID Discord ou nom du joueur',
                type: 3,
                required: true
            }]
        },
        {
            name: 'listestation',
            description: 'Afficher toutes les stations avec propriétaire'
        },
        {
            name: 'locatevehicle',
            description: 'Localiser un véhicule',
            options: [{
                name: 'plate',
                description: 'Plaque d\'immatriculation du véhicule',
                type: 3,
                required: true
            }]
        },
        {
            name: 'setposition',
            description: 'Déplacer un joueur déconnecté',
            options: [
                {
                    name: 'identifier',
                    description: 'ID du joueur',
                    type: 3,
                    required: true
                },
                {
                    name: 'x',
                    description: 'Coordonnée X',
                    type: 10, // NUMBER type
                    required: true
                },
                {
                    name: 'y',
                    description: 'Coordonnée Y',
                    type: 10,
                    required: true
                },
                {
                    name: 'z',
                    description: 'Coordonnée Z',
                    type: 10,
                    required: true
                }
            ]
        },
        {
            name: 'wipe',
            description: 'Wipe un joueur (avec sauvegarde)',
            options: [{
                name: 'identifier',
                description: 'ID du joueur à wipe',
                type: 3,
                required: true
            }]
        },
        {
            name: 'openwl',
            description: 'Ouvrir la whitelist'
        },
        {
            name: 'closewl',
            description: 'Fermer la whitelist'
        },
        {
            name: 'setupwl',
            description: 'Setup message de whitelist'
        }
    ];

    try {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        if (guild) {
            await guild.commands.set(commands);
            console.log('Commandes slash enregistrées avec succès!');
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, member, guild } = interaction;

    try {
        switch (commandName) {
            case 'wl':
                await handleWhitelistCommand(interaction);
                break;
            case 'search':
                await handleSearchCommand(interaction);
                break;
            case 'chars':
                await handleCharsCommand(interaction);
                break;
            case 'listestation':
                await handleListeStationCommand(interaction);
                break;
            case 'locatevehicle':
                await handleLocateVehicleCommand(interaction);
                break;
            case 'setposition':
                await handleSetPositionCommand(interaction);
                break;
            case 'wipe':
                await handleWipeCommand(interaction);
                break;
            case 'openwl':
                await handleOpenWLCommand(interaction);
                break;
            case 'closewl':
                await handleCloseWLCommand(interaction);
                break;
            case 'setupwl':
                await handleSetupWLCommand(interaction);
                break;
        }
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
        
        const errorEmbed = createEmbed(
            '❌ Erreur',
            'Une erreur est survenue lors de l\'exécution de la commande.',
            0xFF0000
        );

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// Commande /wl - Gestion de la whitelist
async function handleWhitelistCommand(interaction) {
    const targetUser = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(targetUser.id);
    
    if (!member) {
        const embed = createEmbed('❌ Erreur', 'Utilisateur introuvable sur le serveur.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        // Ajouter le rôle whitelist
        await member.roles.add(process.env.WHITELIST_ROLE_ID);
        
        // Retirer le rôle non-whitelist
        if (member.roles.cache.has(process.env.NON_WHITELIST_ROLE_ID)) {
            await member.roles.remove(process.env.NON_WHITELIST_ROLE_ID);
        }

        const embed = createEmbed(
            '✅ Whitelist ajoutée',
            `${targetUser.tag} a été ajouté à la whitelist avec succès!`,
            0x00FF00
        );

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la whitelist:', error);
        const embed = createEmbed(
            '❌ Erreur',
            'Impossible d\'ajouter l\'utilisateur à la whitelist.',
            0xFF0000
        );
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

// Importer les fonctions des commandes admin et support
const { handleSearchCommand, handleCharsCommand, handleListeStationCommand } = require('./commands/admin');
const { handleOpenWLCommand, handleCloseWLCommand, handleSetupWLCommand } = require('./commands/support');

// Commande /locatevehicle - Localiser un véhicule
async function handleLocateVehicleCommand(interaction) {
    const requiredRoles = [process.env.MODERATOR_ROLE_ID, process.env.ADMIN_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    const plate = interaction.options.getString('plate');
    const connection = await createDbConnection();
    
    if (!connection) {
        const embed = createEmbed('❌ Erreur', 'Impossible de se connecter à la base de données.', 0xFF0000);
        return interaction.editReply({ embeds: [embed] });
    }

    try {
        const query = `
            SELECT 
                v.*,
                u.firstname,
                u.lastname
            FROM owned_vehicles v
            LEFT JOIN users u ON v.owner = u.identifier
            WHERE v.plate = ?
        `;

        const [rows] = await connection.execute(query, [plate]);
        
        if (rows.length === 0) {
            const embed = createEmbed('❌ Véhicule introuvable', `Aucun véhicule trouvé avec la plaque: ${plate}`, 0xFF0000);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const vehicle = rows[0];
        const vehicleData = JSON.parse(vehicle.vehicle || '{}');
        
        const embed = new EmbedBuilder()
            .setTitle(`🚗 Localisation du véhicule`)
            .setColor(0x0099FF)
            .addFields(
                { name: '🔖 Plaque', value: vehicle.plate, inline: true },
                { name: '👤 Propriétaire', value: `${vehicle.firstname} ${vehicle.lastname}`, inline: true },
                { name: '🚙 Modèle', value: vehicleData.model || 'Inconnu', inline: true },
                { name: '📍 Statut', value: vehicle.stored === 1 ? '🏠 Garage' : '🌍 Monde', inline: true },
                { name: '🗺️ Commande TP', value: `\`/tp ${vehicle.plate}\``, inline: false }
            )
            .setTimestamp();

        if (vehicle.stored === 0) {
            embed.addFields(
                { name: '⚠️ Information', value: 'Le véhicule est actuellement dans le monde. Utilisez la commande TP ci-dessus pour vous téléporter dessus.', inline: false }
            );
        }

        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors de la localisation du véhicule:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la localisation.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

// Commande /setposition - Déplacer un joueur déconnecté
async function handleSetPositionCommand(interaction) {
    const requiredRoles = [process.env.MODERATOR_ROLE_ID, process.env.ADMIN_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    const identifier = interaction.options.getString('identifier');
    const x = interaction.options.getNumber('x');
    const y = interaction.options.getNumber('y');
    const z = interaction.options.getNumber('z');
    
    const connection = await createDbConnection();
    
    if (!connection) {
        const embed = createEmbed('❌ Erreur', 'Impossible de se connecter à la base de données.', 0xFF0000);
        return interaction.editReply({ embeds: [embed] });
    }

    try {
        // Vérifier si le joueur existe
        const checkQuery = 'SELECT identifier, firstname, lastname FROM users WHERE identifier = ?';
        const [checkRows] = await connection.execute(checkQuery, [identifier]);
        
        if (checkRows.length === 0) {
            const embed = createEmbed('❌ Joueur introuvable', 'Aucun joueur trouvé avec cet identifier.', 0xFF0000);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const player = checkRows[0];
        const newPosition = JSON.stringify({ x, y, z, heading: 0.0 });
        
        // Mettre à jour la position
        const updateQuery = 'UPDATE users SET position = ? WHERE identifier = ?';
        await connection.execute(updateQuery, [newPosition, identifier]);
        
        const embed = new EmbedBuilder()
            .setTitle('✅ Position mise à jour')
            .setColor(0x00FF00)
            .addFields(
                { name: '👤 Joueur', value: `${player.firstname} ${player.lastname}`, inline: true },
                { name: '🆔 Identifier', value: identifier, inline: true },
                { name: '📍 Nouvelle position', value: `X: ${x}, Y: ${y}, Z: ${z}`, inline: false },
                { name: '⚠️ Important', value: 'Le joueur ne doit PAS être connecté lors de cette opération.', inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la mise à jour.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

// Commande /wipe - Wipe un joueur avec sauvegarde
async function handleWipeCommand(interaction) {
    const requiredRoles = [process.env.MODERATOR_ROLE_ID, process.env.ADMIN_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    const identifier = interaction.options.getString('identifier');
    const connection = await createDbConnection();
    
    if (!connection) {
        const embed = createEmbed('❌ Erreur', 'Impossible de se connecter à la base de données.', 0xFF0000);
        return interaction.editReply({ embeds: [embed] });
    }

    try {
        // Créer une sauvegarde avant le wipe
        const backupQuery = `
            CREATE TABLE IF NOT EXISTS wipe_backups (
                id INT AUTO_INCREMENT PRIMARY KEY,
                identifier VARCHAR(255),
                backup_data LONGTEXT,
                backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                wiped_by VARCHAR(255)
            )
        `;
        await connection.execute(backupQuery);

        // Récupérer les données du joueur
        const getUserQuery = 'SELECT * FROM users WHERE identifier = ?';
        const [userRows] = await connection.execute(getUserQuery, [identifier]);
        
        if (userRows.length === 0) {
            const embed = createEmbed('❌ Joueur introuvable', 'Aucun joueur trouvé avec cet identifier.', 0xFF0000);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const userData = userRows[0];
        
        // Sauvegarder les données
        const backupData = JSON.stringify(userData);
        const insertBackupQuery = 'INSERT INTO wipe_backups (identifier, backup_data, wiped_by) VALUES (?, ?, ?)';
        await connection.execute(insertBackupQuery, [identifier, backupData, interaction.user.id]);

        // Effectuer le wipe (reset des données importantes)
        const wipeQuery = `
            UPDATE users SET 
                accounts = '{"money":0,"bank":0,"black_money":0}',
                job = '{"name":"unemployed","label":"Unemployed","grade":0,"grade_name":"unemployed","grade_label":"Unemployed","grade_salary":0}',
                gang = '{"name":"none","label":"No Gang","grade":0,"grade_name":"none","grade_label":"No Rank","grade_salary":0}',
                position = '{"x":0.0,"y":0.0,"z":0.0,"heading":0.0}',
                inventory = '[]',
                loadout = '[]',
                metadata = '{}'
            WHERE identifier = ?
        `;
        await connection.execute(wipeQuery, [identifier]);

        // Supprimer les véhicules
        const deleteVehiclesQuery = 'DELETE FROM owned_vehicles WHERE owner = ?';
        await connection.execute(deleteVehiclesQuery, [identifier]);

        const embed = new EmbedBuilder()
            .setTitle('✅ Wipe effectué')
            .setColor(0x00FF00)
            .addFields(
                { name: '👤 Joueur', value: `${userData.firstname} ${userData.lastname}`, inline: true },
                { name: '🆔 Identifier', value: identifier, inline: true },
                { name: '💾 Sauvegarde', value: 'Les données ont été sauvegardées dans la table `wipe_backups`', inline: false },
                { name: '🗑️ Données supprimées', value: '• Argent et banque\n• Métier et gang\n• Inventaire et loadout\n• Véhicules\n• Position', inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors du wipe:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors du wipe.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

// Endpoint de santé pour éviter le sleep sur Render
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot Discord FiveM en ligne',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        bot_status: client.readyAt ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Serveur web démarré sur le port ${PORT}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
