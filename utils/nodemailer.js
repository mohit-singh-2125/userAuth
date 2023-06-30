var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'zaria.damore30@ethereal.email',
        pass: '32p2r2UUXf7eKjDD4h'
    }
});

module.exports = { sendEmail };

function sendEmail(emailTo, templateId, templateBody) {

    return new Promise((resolve, reject) => {
        let htmlBody = '<html><body><h3>Dear User,</h3><br/><p>Your Inventory with ID:+data.id+ is <b>expired</b>.</p><br/><p> Thank You,<br />Team ITSM</p></body></html>';
        let subjectBody = 'Welcome to ITSM Ticketing Too';
       


     {   var mailOptions = {
            
            from: '"BBBB"<zaria.damore30@ethereal.email>',
            to: emailTo,
            subject: subjectBody,
            html: htmlBody
        };
    }
       

        // console.log(JSON.stringify(mailOptions))

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject();
            } else {
                try {
                    console.log('Email sent: ' + info.response,emailTo);
                    // console.log("Password : " + password);
                    resolve(info);
                } catch (error) {
                    console.log('ERROR', error);
                }
            }
        })

    })
}


