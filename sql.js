const mysql = require("mysql");


var con = mysql.createConnection({ // all this info are to change for the working of the mysql table made by ardidex ez
    host: "localhost",
    user: "root",
    password: "penis",
    database: "discord"
});
con.connect(err => {
    if (err) throw err;
    console.log("Connexion mysql effectué")
    con.query("SHOW TABLES", console.log);
});

function pushquestion(question, user, timestamp){
    con.query(`SELECT * FROM questionf WHERE question = "${question.content.toLowerCase()}"`, (err, rows) => {
        if(err) throw err;

        if(rows.length < 1){
            con.query(`INSERT INTO questionf(userid, question, timestamp) VALUES ("${user.id}", "${question.content.toLowerCase()}", "${timestamp}")`, (err, result) => {
                if(err) throw err;
                console.log("QUESTION " + question.content.toLowerCase() + " HAS BEEN ADDED TO 'FAILED QUESTIONS' WITH ID " + result.insertId);
                question.reply("Je n'ai pas trouver de réponses a votre question !")
            });
        }
    })
}

function response(message, author, timestamp, callback) {
    con.query(`SELECT * FROM questionr WHERE question = "${message.content.toLowerCase()}"`, (err,rows) => {
        if(err) throw err;
        if(rows.length < 1) {
            pushquestion(message, author, timestamp);
            
        }else {
            if(rows[0].moderation == 1){
                callback()
            }
            message.reply(rows[0].response);
        }
    })
}

function insertquestion(question, authorid, response, moderation){
    question = question.replace("'", "\'").replace('"', '\"');
    response = response.replace("'", "\'").replace('"', '\"');
    con.query(`INSERT INTO questionr(userid, question, response, moderation) VALUES("${authorid}", "${question}", "${response}", "${moderation}")`, (err, result) => {
        if(err) throw err;
        console.log("QUESTION \"" + question + "\" HAS BEEN ADDED TO DATABASE QUESTIONR WITH ID " + result.insertId +  " !")
    });
}
module.exports = {
    pushquestion,
    response,
    insertquestion
};