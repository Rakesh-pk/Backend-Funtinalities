/// <reference path="../File/index.js" />

const { BaseConnectorProvider, ConnectorResponseStatus } = require('../../providers/Base-Connector-Provider');
const nodemailer = require('nodemailer');


class SendMail extends BaseConnectorProvider {
    constructor() {
        super();
        this.Id = 'hAutomation.Connectors.Outbond.send.mail';
    }

    async run(element, inputData) {
      console.log(inputData)
        try {
            //Server or Host configuration Ex:Gmail,Outlook,Yahoo
            const transporter = nodemailer.createTransport({
                host: inputData.host,          
                port: inputData.port,          
                auth: {
                    user: inputData.username,   
                    pass: inputData.password    
                },
                secure: inputData.securetype,
                tls: { rejectUnauthorized:inputData.connectiontype }
            });

            //email options
            const mailOptions = {
                from: { name: inputData.alias , address: inputData.from }, 
                to: inputData.To,                
                cc: inputData.cc,
                bcc: inputData.bcc,
                subject: inputData.subject,               
                attachments: []
            };

            //Selecting Mail Body Type 
            inputData.bodychoices == 'Text'
                ? mailOptions.text = inputData.textbody
                : mailOptions.html = inputData.htmlbody  

            const attachmentsArray = inputData.attachment;
            //Multiple attachment
            for (const filepath of attachmentsArray) {
                mailOptions.attachments.push({path: filepath});
            }

            const info = await transporter.sendMail(mailOptions); 
            if (info) {
                console.log('Email sent:', info.response);
               return this.successResponse({ MessegeId: info.response.slice(24), Status: "Accepted", response: `Mail has been sent to ${info.accepted}` })
            }

            return this.validationErrorResponse({ Status: "Rejected", response: `something Went wrong while sending Mail to ${info.rejected}` })
            

        }
        catch (e) {
            console.log(e)
            return this.errorResoponse({ response: e })
        }

    }


}



module.exports = SendMail;