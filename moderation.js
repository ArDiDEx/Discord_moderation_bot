const Discord = require('discord.js');
var bot = new Discord.Client();



// L'insulte d'insulte qui serront valable d'un avertissement puis un kick


module.exports = {

  

    /**
     * IA Modération
     * 
     * Begin
     */

    /**
     * 
     * Checking messages of users
     *  
     */

    /**
     * Kick Words check !
     * 
     */


    
    kickc: function(msg, insultes) {
      if (msg.author.bot) return; // return if the message writer is a bot 
      if (msg.guild == undefined) return; // if the guild where the message has been post is undefined return ( can be un defined when it is an private message ) 
      if(" ".replace(/,/gi, ''))
      if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(msg.content)){
        //if(msg.author.hasPermission('KICK_MEMBERS'))return;
        this.kick(msg.guild, msg.author, true, "Invitation : " + msg.content); // use kick function to kick member
        console.log(msg.author.username + " à poster une invitation ( " + msg.content + " ) , ce dernier a donc été expluser !") // log kicked user
        if (msg.deletable) msg.delete(); // delete message
        return true;
      }
      
      insultes.forEach(insulte => { // doing a foreach loop
        if (msg.content.toLowerCase().includes(insulte)) { // if message contains one of our insultes then
          //if(msg.author.hasPermission('KICK_MEMBERS'))return;
          this.kick(msg.guild, msg.author, true, "Insultes : " + insulte); // use kick function to kick member
          console.log(msg.author.username + " à utiliser " + insulte + ", ce dernier a donc été expluser !") // log kicked user
          if (msg.deletable) msg.delete(); // delete message
          return true;
        }
      })

      return false;
    },

    /**
     * Ban Words check !
     */


    banc: function(msg, banword) {
      if (msg.author.bot) return;
      if (msg.guild == undefined) return;
      banword.forEach(word => {
        if (msg.content.toLowerCase().includes(word)) {
          this.ban(msg.guild, msg.author, true, "Insultes grave ! : " + word);
          if (msg.deletable) msg.delete();
          return true;
        }else {return false}
      });
      

    },

    load: function (bot) {
      this.bot = bot;
    },
    /**
     * Ban/Kick
     * 
     * @param {Discord.guild} guild Le serveur ou le joueur a pris une sanction
     * @param {DiscordUser} user Le joueur a sanctionné
     * @param {boolean} Prevent prévenir qu'une sanction est mise 
     * @param {string} reason La raison de la sanction
     */
    ban: function(guild, user, boolean, reason) {
        // Checking if user or guild is undefined
        if(user == undefined || guild == undefined){
          console.log("Le user ou la guild défini n'est pas valable.")
          console.log("guild" + guild);
          console.log("user" + user);
          return;
        }
        user.send("Vous avez été banni de " + guild.name + " pour la raison suivante : " + reason)
        user.send("Si vous pensez que ceci est une erreur, veilliez faire \"!help <message>\" ")
        //guild.ban(user, reason);
        console.log(user);
        if(boolean){
            var embed = new Discord.RichEmbed()
                .setTitle("Sanctions !")
                .setColor(15158332)
                .setAuthor(user.user.username, user.user.avatarURL, undefined)
                .setDescription("Un utilisateur a pris une sanction !")
                .addField("Pseudo: ", user.user.username)
                .addField("Sanction prise: ", "Ban temporaire/définitif")
                .addField("Raison: ", reason)
                .addField("Sanction mise par ", "IA de Modération")
            .setTimestamp();
            try{
              guild.channels.find("name", "🔨Sanctions🔨").send(embed)

            }catch(exception){
              guild.createChannel("🔨Sanctions🔨", "text").then(channel2 => {
                channel2.send(embed)
              });
            }
        }    
    },
    kick: function(guild, user, boolean, reason){
        if(user == undefined || guild == undefined){
          console.log("Le user ou la guild défini n'est pas valable.")
          console.log("guild" + guild);
          console.log("user" + user);
          return;
        }
        user.send("Vous avez été expluser de " + guild.name + " pour la raison suivante : " + reason)
        user.send("Si vous pensez que ceci est une erreur, veilliez faire \"!help <message>\" ")
        //guild.kick(user, reason);
        if(boolean){
          var embed = new Discord.RichEmbed()
          .setTitle("Sanctions !")
          .setColor(15158332)
          .setAuthor(user.username, user.avatarURL, undefined)
          .setDescription("Un utilisateur a pris une sanction !")
          .addField("Pseudo: ", user.username)
          .addField("Sanction prise: ", "Kick")
          .addField("Raison: ", reason)
          .addField("Sanction mise par ", "IA de Modération")
          .setTimestamp()
          try{
            guild.channels.find("name", "🔨Sanctions🔨").send(embed)

          }catch(exception){
            guild.createChannel("🔨Sanctions🔨", "text").then(channel2 => {
              channel2.send(embed)
            });
          }        }
    }
}