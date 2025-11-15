const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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

// Commande /openwl - Ouvrir la whitelist
async function handleOpenWLCommand(interaction) {
    const requiredRoles = [process.env.SUPPORT_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        const guild = interaction.guild;
        
        // Récupérer les channels WL
        const wlChannel = guild.channels.cache.get(process.env.WL_CHANNEL_ID);
        const announcementChannel = guild.channels.cache.get(process.env.WL_ANNOUNCEMENT_CHANNEL_ID);
        
        if (!wlChannel) {
            const embed = createEmbed('❌ Erreur', 'Le channel WL n\'a pas été trouvé. Vérifiez la configuration.', 0xFF0000);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Ouvrir le channel pour @everyone
        await wlChannel.permissionOverwrites.edit(guild.roles.everyone, {
            [PermissionFlagsBits.ViewChannel]: true,
            [PermissionFlagsBits.SendMessages]: true,
            [PermissionFlagsBits.AttachFiles]: true
        });

        // Ouvrir le salon vocal WL si configuré
        const wlVoiceChannel = guild.channels.cache.get(process.env.WL_VOICE_CHANNEL_ID);
        if (wlVoiceChannel) {
            await wlVoiceChannel.permissionOverwrites.edit(guild.roles.everyone, {
                [PermissionFlagsBits.ViewChannel]: true,
                [PermissionFlagsBits.Connect]: true,
                [PermissionFlagsBits.Speak]: true
            });
        }

        // Message d'annonce simple
        if (announcementChannel) {
            await announcementChannel.send('@everyone\n🟢 **Les WL sont ON**');
        }

        // Réponse à la commande
        const embed = createEmbed(
            '✅ Whitelist ouverte',
            'Le salon de whitelist a été ouvert avec succès !\n\n• <#' + process.env.WL_CHANNEL_ID + '>',
            0x00FF00
        );

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la whitelist:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de l\'ouverture de la whitelist.', 0xFF0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

// Commande /closewl - Fermer la whitelist
async function handleCloseWLCommand(interaction) {
    const requiredRoles = [process.env.SUPPORT_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        const guild = interaction.guild;
        
        // Récupérer les channels WL
        const wlChannel = guild.channels.cache.get(process.env.WL_CHANNEL_ID);
        const announcementChannel = guild.channels.cache.get(process.env.WL_ANNOUNCEMENT_CHANNEL_ID);
        
        if (!wlChannel) {
            const embed = createEmbed('❌ Erreur', 'Le channel WL n\'a pas été trouvé. Vérifiez la configuration.', 0xFF0000);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Fermer le channel pour @everyone
        await wlChannel.permissionOverwrites.edit(guild.roles.everyone, {
            [PermissionFlagsBits.ViewChannel]: false,
            [PermissionFlagsBits.SendMessages]: false,
            [PermissionFlagsBits.AttachFiles]: false
        });

        // Fermer le salon vocal WL si configuré
        const wlVoiceChannel = guild.channels.cache.get(process.env.WL_VOICE_CHANNEL_ID);
        if (wlVoiceChannel) {
            await wlVoiceChannel.permissionOverwrites.edit(guild.roles.everyone, {
                [PermissionFlagsBits.ViewChannel]: false,
                [PermissionFlagsBits.Connect]: false,
                [PermissionFlagsBits.Speak]: false
            });
        }

        // Message d'annonce simple
        if (announcementChannel) {
            await announcementChannel.send('@everyone\n🔴 **Les WL sont OFF**\nSurveillez les futures ⁠📣annonces-whitelist pour pouvoir tenter votre chance');
        }

        // Réponse à la commande
        const embed = createEmbed(
            '✅ Whitelist fermée',
            'Le salon de whitelist a été fermé avec succès !\n\n• <#' + process.env.WL_CHANNEL_ID + '>',
            0xFF0000
        );

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Erreur lors de la fermeture de la whitelist:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors de la fermeture de la whitelist.', 0xFF0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

// Commande /setupwl - Setup message de whitelist
async function handleSetupWLCommand(interaction) {
    const requiredRoles = [process.env.SUPPORT_ROLE_ID];
    
    if (!hasPermission(interaction.member, requiredRoles)) {
        const embed = createEmbed('❌ Accès refusé', 'Vous n\'avez pas les permissions pour utiliser cette commande.', 0xFF0000);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        const guild = interaction.guild;
        const announcementChannel = guild.channels.cache.get(process.env.WL_ANNOUNCEMENT_CHANNEL_ID);
        
        if (!announcementChannel) {
            const embed = createEmbed('❌ Erreur', 'Le channel d\'annonce n\'a pas été trouvé. Vérifiez la configuration.', 0xFF0000);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Message de setup de la whitelist pour Acadia
        const setupEmbed = new EmbedBuilder()
            .setTitle('Bonjour à tous !')
            .setDescription(`
🔮 **PROCHAINE SESSION DE WHITELIST** le Mardi 18 Novembre de 16h00 à 20h00

**➜ Conditions pour passer sa WL :**
• Avoir 17ans et +
• Avoir un bon micro
• Être sur PC et non sur téléphone portable
• Avoir pris connaissance du 📋 règlement
• Avoir une idée de votre background
• Dans votre pseudo avoir [Job ou projet] devant votre nom et prénom RP
*Exemple: [LSPD] Nom Prénom RP - [Ballas] Nom Prénom RP*

🟢 **Projet légal disponible :**
• LSPD
• EMS
• Avocats

🟣 **Projet illégal disponible :**
• Groupe Asiatique
• F4L
• Vagos
• Groupe libre
            `)
            .setColor(0x7B68EE)
            .setThumbnail(guild.iconURL())
            .setTimestamp();

        await announcementChannel.send({ embeds: [setupEmbed] });

        // Réponse à la commande
        const embed = createEmbed(
            '✅ Setup effectué',
            'Le message d\'information de la whitelist a été envoyé avec succès !',
            0x00FF00
        );

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Erreur lors du setup de la whitelist:', error);
        const embed = createEmbed('❌ Erreur', 'Une erreur est survenue lors du setup de la whitelist.', 0xFF0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

module.exports = {
    handleOpenWLCommand,
    handleCloseWLCommand,
    handleSetupWLCommand
};
