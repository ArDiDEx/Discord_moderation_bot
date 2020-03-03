module.exports = {
    isQuestionReponse: function (msg) {
        if (msg.content.includes("carré rose") || msg.content.includes("carrer rose") || msg.content.includes("carrér rose")) {
            msg.reply("De très bon youtubeurs ont fait des vidéo comment règler ceci, je t'invite a faire une recherche sur internet !")
        }
        if(msg.content.includes("twitter") && msg.content.includes("quoi")){
            msg.reply("Le twitter est: https://twitter.com/ardidex");
        }
        console.log(msg.content);
    }
}