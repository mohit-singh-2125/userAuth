let ElasticEmail = require('@elasticemail/elasticemail-client');
const {MAIL_CONFIG}=require("../config/config")


let defaultClient = ElasticEmail.ApiClient.instance;

let apikey = defaultClient.authentications['apikey'];
apikey.apiKey = MAIL_CONFIG.API_KEY 

let api = new ElasticEmail.EmailsApi()


const sendEmail = (recipient, content) => {
    let email = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient(recipient)
        ],
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                    ContentType: "HTML",
                    Content: "<html><body><lable>Hi "+content.userName+"</lable><br/><lable>Your verification OTP is:<strong>"+content.otp+"</strong></lable></body></html>"
                })
            ],
            Subject: "TVISHA USER AUTH OTP",
            From: MAIL_CONFIG.SENDER_EMAIL 
        }
    });

    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully.');
        }
    };
     api.emailsPost(email, callback);
}
module.exports = {
    sendEmail
}
