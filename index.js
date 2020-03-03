
// Constructors for the being occuped of the bot working
const Discord = require('discord.js');
const bot = new Discord.Client();
const moderation = require('./moderation');
const utils = require('./utils')
const questionreponse = require('./questionreponse');
const sql = require('./sql');
const config = require("./config.json");
//const fs = require("fs");
var prefix = "!";


var drchannel = 638370158133510146;
var previousmessageid; // j'avoue c'est peut-être possible chercher dans le channel les msg posté par le bot et vérifie si le message coicide, mais un peu la flemme

/** TODO:
var warnings = {
  //on ajouteras au fur et à mesure des warnings au joueurs :) (Ces derniers sont temporaires, jusqu'à que le bot sois redemarré :) ) 
}
*/
//const xhr = require("xmlhttprequest").XMLHttpRequest; ** USED FOR MAKING REQUEST TO A HTML PAGE !
//const mysql = require("mysql"); ** MYSQL CONST 
bot.login(config.token);

bot.on('ready', () => {
  // Bot online ! Setup some things before :p
  console.log(bot.guilds);
  bot.user.setActivity('Prêt a être utiliser !', { type: 3 }); // setting activity
  moderation.load(bot); // loading bot to moderation configuration.
  // used for some debug : bot.guilds.find("id", "626418146038775819").channels.find("id", "627600146338807849").send("Récréation de la commande !console en cours...")
});
bot.on('message', msg => {
  if (msg.guild == undefined) return;
  if (msg.author.bot) return;
  if (msg.channel.id == "640377512165244928") {
    sql.response(msg, msg.author, msg.createdTimestamp, () => {
      moderation.kick(msg.guild, msg.author, true, "Insulte : " + msg.content);
    });
  }
})

bot.on('message', msg => {
  if (msg.content.startsWith("!addquestion ")) {
    if(!msg.author.hasPermission('MANAGE_MESSAGES'))return;
    var question = msg.content.replace("!addquestion ", "");
    const filter = m => m.author.id === msg.author.id;
    msg.reply("Veilliez maintenant préciser une réponse a la question. ( vous avez 60s ) ")
    msg.channel.awaitMessages(filter, {
      max: 1,
      time: 60000
    }).then(collected => {
      if (collected.first().content === "cancel") {
        return msg.reply("Ajout annulé !");
      }
      var response = collected.first().content;
      msg.reply("Veilliez maintenant préciser une moderation, 1 = l'utilisateur seras sanctionner si il poste cette question 0 = l'utilisateur ne seras pas sanctionner. ( vous avez 60s )")
      msg.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      }).then(collectedde => {
        if (collected.first().content === "cancel") {
          return msg.reply("Ajout annulé !");
        }
        var moderation = collectedde.first().content;
        msg.reply("Votre reponse à la question : \"" + question + "\" à bien été transféré dans la bdd !")
        sql.insertquestion(question, msg.author.id, response, moderation);
      });


    });
  }
});
bot.on('guildCreate', guild => {
  let channels = guild.channels;
  channelLoop:
  for (let c of channels) {
    let channelType = c[1].type;
    if (channelType === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }
  let channel = bot.channels.get(guild.systemChannelID || channelID);
  var embed = new Discord.RichEmbed()
    .setTitle("Salut", "Merci de m'avoir ajouté a votre serveur discord")
    .setColor(3066993)
    .addField("Modération", "J'ai un système de modération performant (du moins je pense).")
    .addField("Sanctions", "Toute sanction serras envoyé dans le channel \"Sanctions\"")
    .addField("Merci !", "Merci de m'avoir ajouté, collaborons ensemble désormais ^^.")
    .addField("Language", "Chaque utilisateur doit veilliez a son language, sinon des sanctions seront appliqués !")
    .setTimestamp()
    .setAuthor(bot.user.username, bot.user.avatarURL);
  channel.send(embed);

  guild.createChannel("🔨Admin🔨", "text").then(channel2 => {
    var embed = new Discord.RichEmbed()
      .setTitle("Ticket")
      .setColor(3066993)
      .addField("Important", "Ne pas renommer ce channel. Le bot ne marcheras pas si vous renommez ce channel !")
      .addField("Ticket", "Tout les tickets fait par les joueurs en mp seront envoyé ici sous forme d'embed. Vous pourrez y répondre en faisant \"!response <id> <réponse>\"")
      .setTimestamp()
      .setAuthor(bot.user.username, bot.user.avatarURL)
    channel2.send(embed);
  })
  guild.createChannel("🔨Sanctions🔨", "text").then(channel2 => {

    var embed = new Discord.RichEmbed()
      .setTitle("Sanction", "Voici les explications du pourquoi ce channel est crée")
      .setColor(3066993)
      .addField("Important", "Ne pas renommer ce channel. Le bot ne marcheras pas si vous renommez ce channel !")
      .addField("Raison", "Chaque sanction faite par un utilisateur serras posté ci dessous expliquant ce qu'il a pris comme sanction et la raison")
      .addField("Conseil", "Mettre ce channel pour les membres du staff. Ce channel peut être assez spammant et peux envoyer des liens que les utilisateurs ont posté :)")
      .addField("Exemple", "Un exemple de ce que le bot peux faire comme message serront posté ci dessous")
      .setTimestamp()
      .setAuthor(bot.user.username, bot.user.avatarURL);
    channel2.send(embed);
    var user = bot;
    var reason = "à posté une invitation : https://www.discordapp.com/invite"
    var embed = new Discord.RichEmbed()
      .setTitle("Sanctions !")
      .setColor(15158332)
      .setAuthor(user.user.username, user.user.avatarURL, undefined)
      .setDescription("Un utilisateur a pris une sanction !")
      .addField("Pseudo: ", user.user.username)
      .addField("Sanction prise: ", "Kick")
      .addField("Raison: ", reason)
      .addField("Sanction mise par ", "IA de Modération")
      .setTimestamp()
    channel2.send(embed)

    var reason = "Propos racistes à multiple reprise: \"Sale noir, retourne dans ton pays\"";
    var embed = new Discord.RichEmbed()
      .setTitle("Sanctions !")
      .setColor(15158332)
      .setAuthor(user.user.username, user.user.avatarURL, undefined)
      .setDescription("Un utilisateur a pris une sanction !")
      .addField("Pseudo: ", user.user.username)
      .addField("Sanction prise: ", "Ban")
      .addField("Raison: ", reason)
      .addField("Sanction mise par ", "IA de Modération")
      .setTimestamp()
    channel2.send(embed)
  })


});



/**
 * 
 * Help cmd !
 * @author ArDiDEx
 */

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.guild == undefined) return;
    if (msg.content.startsWith("!help ")) {
      msg.reply('Votre demande a bien été envoyer aux Administrateurs du serveur "' + bot.guilds.find("id", "635845883031715880").name + "\" !");
      var embed = new Discord.RichEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setTitle("Ticket Administrateur !")
        .setColor(1752220)
        .setTimestamp()
        .addField("ID", msg.author.id)
        .addField("Ticket", msg.content.replace("!help ", ""))
      bot.guilds.find("id", "635845883031715880").channels.find("name", "🔨admin🔨").send(embed)
      try {
        guild.channels.find("name", "🔨Sanctions🔨").send(embed)

      } catch (exception) {
        guild.createChannel("🔨Sanctions🔨", "text").then(channel2 => {
          channel2.send(embed)
        });
      }
    }

  if (msg.content.startsWith("!respond ")) {
    if (msg.deletable) msg.delete();
    var id = msg.content.replace("!respond ").split(" ")[0].replace("undefined", "");
    var embed = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setTitle("Ticket Administrateur")
      .setColor(1752220)
      .setDescription("Un Administrateur vous à répondu !")
      .setTimestamp()
      .addField("ID", msg.author.id)
      .addField("Reponse", msg.content.replace("!respond ", "").replace(msg.content.replace("!respond ", "").split(" ")[0], ""))
    bot.fetchUser(id).then((User) => {
      User.send(embed);
    })
  }
  if (msg.content.startsWith("!ban ")) {
    if (!msg.content.replace("!ban ", "") == "") {
      msg.channel.fetchMessage(msg.content.replace("!ban ", "")).then(msg2 => {
        if (msg2.deletable) msg2.delete();
        /**
         * Sql system (mysql connection INSERT )
         * TODO:
         */
        msg.reply("Le message a bien été enregistré dans notre base de données, merci de nous faire confiance.")
      });

    }
  }
    /**
   *  
   *  Delete reposte message demonstration 
   * 
   */

    if(msg.author.bot)return;
    if(msg.channel.id == drchannel){
      var channel = msg.channel;
      if(previousmessageid == undefined){
        channel.send("Hey, une question gmod ? #<684439046365511830>\n une question gtarp ? #<684439054351466569>").then(message => {
          previousmessageid == message.id;
        })
      }else{
        if(msg.channel.fetchMessage(previousmessageid).deletable)msg.channel.fetchMessage(previousmessageid).delete;
        channel.send("Hey, une question gmod ? #<684439046365511830>\n une question gtarp ? #<684439054351466569>").then(message => {
          previousmessageid == message.id;
        })
      }
    }
})

/**
 * 
 * Question response
 */

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.guild == undefined) return;
  //console.log(msg.guild);
  if (msg.channel.id == "640377512165244928") return;
  if (moderation.banc(msg, utils.getbanwords()) == true) {
    // user used an ban word
    return;
  }
  if (moderation.kickc(msg, utils.getinsultes()) == true) {
    // user used an kick word
    return;
  }
  questionreponse.isQuestionReponse(msg);

})


/**
 * 
 * @author ArDiDEx
 * @utilité Détecte les messages posté dans un channel d'aide.
 * 
 * 
 */

bot.on('message', msg => {
  if (msg.guild == undefined) return;
  if (msg.author.bot) return;
  if (msg.channel.id == 632543811717038090) {
    if (msg.mentions.first.id == "623197979721072641") {
      msg.reply("")
    }
  }
});

/**
 * Commands
 *  
 * @author ArDiDEx;
 * @constructor bot
*/

bot.on('message', msg => {
  if (msg.guild == undefined) return;
  if (msg.author.bot) return;
  if (msg.content.startsWith("!mpall ")) {
    msg.guild.members.array.forEach(element => {
      element.send(msg.content.replace("!mpall ", ""));
    });
    msg.reply("Le mp a bien été distribuer à: " + (msg.guild.members.size() - 1));
  }
  if (msg.content == "!info") {
    var embed = new Discord.RichEmbed();
    embed
      .setTitle("Information V1.0")
      .setAuthor(msg.author.username, msg.author.avatarURL, undefined)
      .setDescription("Information envers -> " + msg.author.username)
      .addField("Name", msg.author.username, true)
      .addField("id", msg.author.id, true)
      .addField("#", msg.author.discriminator, true)
      .addField("Plus d'information je ne pourrais pas vous donner.", "Terminé", true)
      .setTimestamp();
    msg.reply(embed);
  }
  if (msg.content == "!delete") {
    if (!msg.member.hasPermission("ADMINISTRATOR")) return;
    msg.guild.roles.forEach(role => role.delete())
    //msg.guild.channels.forEach(channel => { if (channel == msg.channel) return; if (channel.id == "631518649529794592") return; channel.delete() })
  }
  if (msg.content == "!serverinfo") {
    var embed = new Discord.RichEmbed();
    embed
      .setTitle("Information V1.0")
      .setAuthor(msg.guild.name, msg.guild.avatarURL, undefined)
      .setDescription("Information envers --> " + msg.guild.name)
      .addField("Name", msg.guild.name, true)
      .addField("Nombre de canals", msg.guild.channels.size)
      .addField("Identifiant du serveur", msg.guild.id)
      .addField("Region", msg.guild.region)
      .addField("Nombre de membres", msg.guild.memberCount)
      .addField("Niveau de Verification", msg.guild.verificationLevel)
      .addField("Niveau du Filtre anti contenu explicit", msg.guild.explicitContentFilter)
      .addField("Créateur", msg.guild.members.find("id", msg.guild.ownerID).username)
      .addField("Nombre d'émojis disponible", msg.guild.emojis.size)
      .setTimestamp();

    msg.channel.send(embed);
  }
  /*
  if (msg.content == "!reset") {
    var guild = msg.guild;
    if (guild == undefined) return;
    if (!msg.member.hasPermission("ADMINISTRATOR")) return;
    guild.channels.forEach(channel => { if (channel == msg.channel) return; if (channel.id == "631518649529794592") return; channel.delete() })
    guild.roles.forEach(role => role.delete())
    var joueur = 0;
    var administration = 0;
    var Utils = 0;


    msg.guild.createChannel(`Joueurs`, { type: 'category' }).then(channel => {
      joueur = channel.id;
    })
    msg.guild.createChannel(`Utils`, {
      type: 'category',
      permissionOverwrites: [{
        id: msg.guild.id,
        allow: ['READ_MESSAGES'],
        deny: ['SEND_MESSAGES']
      }]
   }).then(channel => {
      Utils = channel.id;
      console.log(channel.id)
    })
    msg.guild.createChannel(`Administration`, { type: 'category',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }] }).then(channel => {
      administration = channel.id;
      channel.setpermiss
    })

    msg.guild.createChannel(`Général`, { type: 'text' }).then(channel => {
      channel.setParent(joueur);
      channel.setTopic("Channel pour discuter")
    });
    msg.guild.createChannel(`Media`, { type: 'text' }).then(channel => {
      channel.setParent(joueur);
      channel.setTopic("Channel pour les images/vidéos")

    });
    msg.guild.createChannel(`Commandes-bot`, { type: 'text' }).then(channel => {
      channel.setParent(joueur);
      channel.setTopic("Channel pour les commandes des diverts bots")

    });
    msg.guild.createChannel(`gta`, { type: 'voice' }).then(channel => {
      channel.setParent(joueur);
    });
    msg.guild.createChannel(`gmod`, { type: 'voice' }).then(channel => {
      channel.setParent(joueur);
    });
    msg.guild.createChannel(`Rocket League`, { type: 'voice' }).then(channel => {
      channel.setParent(joueur);
    });
    msg.guild.createChannel(`LOL`, { type: 'voice' }).then(channel => {
      channel.setParent(joueur);
    });
    msg.guild.createChannel(`Fortnite`, { type: 'voice' }).then(channel => {
      channel.setParent(joueur);
    });
    msg.guild.createChannel(`Développement`, { type: 'text' }).then(channel => {
      channel.setTopic("Channel ou seront posté des images ou des discussions de développeur")
      channel.setParent(Utils);
    });
    msg.guild.createChannel(`Site`, { type: 'text' }).then(channel => {
      channel.setParent(Utils);
      channel.setTopic("Channel ou serras afficher certain site que nous vous recommandons")

    });
    msg.guild.createChannel(`Tuto`, { type: 'text' }).then(channel => {
      channel.setParent(Utils);
      channel.setTopic("Channel ou serront poster des tutos")

    });
    msg.guild.createChannel(`StaffChat`, { type: 'text',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }] }).then(channel => {
      channel.setParent(administration);
      channel.setTopic("Channel pour discuter entre les staffs")

    });
    msg.guild.createChannel(`Bugs`, { type: 'text',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }] }).then(channel => {
      channel.setParent(administration);
      channel.setTopic("Channel pour discuter/reporter de certain bugs")

    });
    msg.guild.createChannel(`DeveloppersChat`, { type: 'text',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }] }).then(channel => {
      channel.setTopic("Channel pour discuter entre développeurs")
      channel.setParent(administration);
    });
    msg.guild.createChannel(`Staff `, { type: 'voice',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }] }).then(channel => {
      channel.setParent(administration);
    });
    msg.guild.createChannel(`Developpers`, { type: 'voice',
    permissionOverwrites: [{
      id: msg.guild.id,
      deny: ['READ_MESSAGES',  'SEND_MESSAGES']
    }]}).then(channel => {
      channel.setParent(administration);
    });






    msg.guild.createRole({
      name: `Adminstrateur `,
      color: 'RED',
    })

  }

  */



})

/*
bot.on('message', msg => {
  let args = msg.content.slice(prefix.length).trim().split(' ');
  let cmd = args.shift().toLowerCase();

  if(msg.author.bot) return;

  if(!msg.content.startsWith(prefix)) return;

  try{

    delete require.cache[require.resolve(`./Commande/${cmd}.js`)];

    let commandFile = require(`./Commande/${cmd}.js`);
    commandFile.run(bot, msg, args);


  }catch(exception){
    console.log(exception)
  }
});
*/