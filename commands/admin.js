const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'essentialmode'
};

async function createDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        return null;
    }
}

function createEmbed(title, description, color = 0x0099FF) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

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

// Commande /search - Rechercher un joueur
async function handleSearchCommand(interaction) {
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
        // Recherche du joueur par Discord ID ou nom
        let query = `
            SELECT 
                u.identifier,
                u.firstname,
                u.lastname,
                u.dateofbirth,
                u.sex,
                u.height,
                u.skin,
                u.position,
                u.accounts,
                u.job,
                u.job_grade,
                u.gang,
                u.gang_grade,
                u.loadout,
                u.metadata,
                COUNT(DISTINCT v.plate) as total_vehicles,
                MIN(u.last_seen) as first_connection,
                MAX(u.last_seen) as last_connection
            FROM users u
            LEFT JOIN owned_vehicles v ON u.identifier = v.owner
            WHERE u.identifier LIKE ? OR CONCAT(u.firstname, ' ', u.lastname) LIKE ?
            GROUP BY u.identifier
            LIMIT 1
        `;

        const [rows] = await connection.execute(query, [`%${identifier}%`, `%${identifier}%`]);
        
        if (rows.length === 0) {
            const embed = createEmbed('❌ Aucun résultat', 'Aucun joueur trouvé avec cet identifiant.', 0xFF0000);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const player = rows[0];
        const jobData = JSON.parse(player.job || '{}');
        const gangData = JSON.parse(player.gang || '{}');
        
        // Récupération du Discord ID depuis l'identifier
        const discordId = player.identifier.split(':')[1];
        let discordMention = 'Non trouvé';
        
        try {
            const user = await interaction.client.users.fetch(discordId);
            discordMention = `<@${discordId}> (${user.tag})`;
        } catch (error) {
            discordMention = `ID: ${discordId}`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔍 Informations du joueur`)
            .setColor(0x0099FF)
            .addFields(
                { name: '👤 Nom', value: `${player.firstname} ${player.lastname}`, inline: true },
                { name: '🆔 Identifier', value: player.identifier, inline: true },
                { name: '💬 Discord', value: discordMention, inline: true },
                { name: '💼 Métier', value: `${jobData.label || 'Aucun'} - Grade: ${jobData.grade_label || 'Aucun'}`, inline: true },
                { name: '🏴 Gang', value: `${gangData.label || 'Aucun'} - Grade: ${gangData.grade_label || 'Aucun'}`, inline: true },
                { name: '🚗 Véhicules', value: `${player.total_vehicles} véhicule(s)`, inline: true },
                { name: '📅 Première connexion', value: player.first_connection ? new Date(player.first_connection).toLocaleString('fr-FR') : 'Inconnue', inline: true },
                { name: '🕐 Dernière connexion', value: player.last_connection ? new Date(player.last_connection).toLocaleString('fr-FR') : 'Inconnue', inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la recherche.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

// Commande /chars - Afficher tous les personnages
async function handleCharsCommand(interaction) {
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
        // Recherche de tous les personnages du joueur
        const query = `
            SELECT 
                identifier,
                firstname,
                lastname,
                dateofbirth,
                sex,
                job,
                gang,
                accounts,
                last_seen
            FROM users 
            WHERE identifier LIKE ? OR CONCAT(firstname, ' ', lastname) LIKE ?
            ORDER BY last_seen DESC
        `;

        const [rows] = await connection.execute(query, [`%${identifier}%`, `%${identifier}%`]);
        
        if (rows.length === 0) {
            const embed = createEmbed('❌ Aucun résultat', 'Aucun personnage trouvé avec cet identifiant.', 0xFF0000);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setTitle(`👥 Personnages trouvés (${rows.length})`)
            .setColor(0x0099FF)
            .setTimestamp();

        let description = '';
        
        rows.forEach((char, index) => {
            const jobData = JSON.parse(char.job || '{}');
            const gangData = JSON.parse(char.gang || '{}');
            const accounts = JSON.parse(char.accounts || '{}');
            
            description += `**${index + 1}. ${char.firstname} ${char.lastname}**\n`;
            description += `🆔 ID: \`${char.identifier}\`\n`;
            description += `💼 Métier: ${jobData.label || 'Aucun'}\n`;
            description += `🏴 Gang: ${gangData.label || 'Aucun'}\n`;
            description += `💰 Argent: $${accounts.money || 0} | Banque: $${accounts.bank || 0}\n`;
            description += `🕐 Dernière connexion: ${char.last_seen ? new Date(char.last_seen).toLocaleString('fr-FR') : 'Inconnue'}\n\n`;
        });

        embed.setDescription(description);
        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors de la recherche des personnages:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la recherche.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

// Commande /listestation - Lister les stations avec propriétaire
async function handleListeStationCommand(interaction) {
    const requiredRoles = [process.env.MODERATOR_ROLE_ID, process.env.ADMIN_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    const connection = await createDbConnection();
    
    if (!connection) {
        const embed = createEmbed('❌ Erreur', 'Impossible de se connecter à la base de données.', 0xFF0000);
        return interaction.editReply({ embeds: [embed] });
    }

    try {
        // Requête pour récupérer les stations avec propriétaire
        const query = `
            SELECT 
                s.*,
                u.firstname,
                u.lastname
            FROM fuel_stations s
            LEFT JOIN users u ON s.owner = u.identifier
            WHERE s.owner IS NOT NULL AND s.owner != ''
            ORDER BY s.name
        `;

        const [rows] = await connection.execute(query);
        
        if (rows.length === 0) {
            const embed = createEmbed('📍 Stations', 'Aucune station avec propriétaire trouvée.', 0xFFFF00);
            await connection.end();
            return interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setTitle(`⛽ Stations avec propriétaire (${rows.length})`)
            .setColor(0x0099FF)
            .setTimestamp();

        let description = '';
        
        rows.forEach((station, index) => {
            description += `**${index + 1}. ${station.name || 'Station sans nom'}**\n`;
            description += `👤 Propriétaire: ${station.firstname} ${station.lastname}\n`;
            description += `🆔 Owner ID: \`${station.owner}\`\n`;
            description += `💰 Prix: $${station.fuel_price || 'N/A'} par litre\n\n`;
        });

        embed.setDescription(description);
        await interaction.editReply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des stations:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la récupération des stations.', 0xFF0000);
        await interaction.editReply({ embeds: [embed] });
    } finally {
        await connection.end();
    }
}

module.exports = {
    handleSearchCommand,
    handleCharsCommand,
    handleListeStationCommand
};
