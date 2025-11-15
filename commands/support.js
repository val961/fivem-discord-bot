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

        // Message d'annonce
        const announcementEmbed = new EmbedBuilder()
            .setTitle('🟢 WHITELIST OUVERTE')
            .setDescription('Les candidatures pour la whitelist sont maintenant **OUVERTES** !\n\n📝 Vous pouvez maintenant postuler dans le salon :\n• <#' + process.env.WL_CHANNEL_ID + '>')
            .setColor(0x00FF00)
            .setTimestamp();

        // Envoyer le message d'annonce si le channel existe
        if (announcementChannel) {
            await announcementChannel.send({ 
                content: '@everyone',
                embeds: [announcementEmbed] 
            });
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

        // Message d'annonce
        const announcementEmbed = new EmbedBuilder()
            .setTitle('🔴 WHITELIST FERMÉE')
            .setDescription('Les candidatures pour la whitelist sont maintenant **FERMÉES** !\n\n❌ Le salon de candidature n\'est plus accessible.\n⏳ Restez à l\'écoute pour la prochaine ouverture.')
            .setColor(0xFF0000)
            .setTimestamp();

        // Envoyer le message d'annonce si le channel existe
        if (announcementChannel) {
            await announcementChannel.send({ 
                content: '@everyone',
                embeds: [announcementEmbed] 
            });
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

        // Message de setup de la whitelist
        const setupEmbed = new EmbedBuilder()
            .setTitle('📋 INFORMATIONS WHITELIST')
            .setDescription(`
**Bienvenue sur notre serveur FiveM !**

Pour rejoindre notre communauté, vous devez passer par le processus de whitelist.

**📝 Comment postuler :**
• Attendez l'ouverture de la whitelist (annoncée ici)
• Rendez-vous dans le salon de candidature
• Remplissez le formulaire de candidature
• Attendez la validation de votre dossier

**📋 Salon de candidature :**
• <#${process.env.WL_CHANNEL_ID}>

**⚠️ Règles importantes :**
• Une seule candidature par personne
• Respectez le format demandé
• Soyez patient pour la réponse
• Pas de relance en MP

**🎮 Bonne chance à tous !**
            `)
            .setColor(0x0099FF)
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
