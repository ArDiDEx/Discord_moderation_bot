module.exports = {
    getbanwords: function() {
        var banword = [
            "sal handicaper",
            "sale handicaper",
            "sale handicapé",
            "sal handicapé",
            "sale handicapez",
            "sal handicapez"
        ];
          
        return banword; 
    },
    getinsultes: function() {
        var insultes = [
            "fdp",
            "nique ta mère",
            "ntm"
        ];
        return insultes;
    },
    fetch: async function(channel, limit) {
        const sum_messages = [];
        let last_id;
    
        while (true) {
            let options;
            if(limit < 100){
                options = { limit: 2 };
            }else {
                options = { limit: 100 };

            }
            if (last_id) {
                options.before = last_id;
            }
    
            const messages = await channel.fetchMessages(options);
            sum_messages.push(...messages.array());
            if(messages.last() == undefined) messages.delete(messages.last());
            console.log(messages.last().id)
            last_id = messages.last().id;
    
            if (sum_messages.length >= limit) {
                break;
            }
        }
    
        return sum_messages;
    }
    
}