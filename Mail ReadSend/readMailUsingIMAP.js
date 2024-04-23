const Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;


module.exports.fetchAllMails = async (req, res) => {
  // IMAP configuration
  const imapConfig = {
    // user: 'rakeshpk97@gmail.com',
    // password: 'rakesh420420',
    user: "rakesh.kumbar@featsystems.com",
    password: "Rakesh@97",
    host: "mail.featsystems.com",
    port: 993,
    tls: true,
  };

  // Create a new IMAP client
  const imap = new Imap(imapConfig);

  // Function to fetch emails
  // Function to fetch emails
function fetchEmails() {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Wait for 5 seconds before executing
        imap.connect();
  
        imap.once("ready", () => {
          imap.openBox("INBOX", true, (error, box) => {
            if (error) {
              reject(error);
              return;
            }
  
            imap.search(["ALL"], (searchError, results) => {
              if (searchError) {
                reject(searchError);
                return;
              }
  
              const fetch = imap.fetch(results, { bodies: "" });
  
              let allMails = [];
  
              fetch.on("message", (msg) => {
                let emailData = {};
  
                msg.on("body", (stream) => {
                  simpleParser(stream, (parseError, parsed) => {
                    if (parseError) {
                      console.log("Error parsing email:", parseError);
                      return;
                    }
  
                    emailData.subject = parsed.subject;
                    emailData.from = parsed.from.text;
                    emailData.body = parsed.text;
                    emailData.attachments = [];
  
                    if (parsed.attachments && parsed.attachments.length > 0) {
                      for (const attachment of parsed.attachments) {
                        const attachmentData = {
                          filename: attachment.filename,
                          contentType: attachment.contentType,
                          content: attachment.content.toString("base64"),
                        };
                        emailData.attachments.push(attachmentData);
                      }
                    }
                  });
                });
  
                msg.once("attributes", (attrs) => {
                  emailData.seen = attrs.flags.includes("\\Seen");
                });
  
                allMails.push(emailData);
              });
  
              fetch.once("end", () => {
                resolve(allMails);
                imap.end();
              });
            });
          });
        });
  
        imap.once("error", (error) => {
          reject(error);
        });
  
        imap.once("end", () => {
          console.log("Connection ended.");
        });
      }, 5000); // Wait for 5 seconds
    });
  }
  

  // Call the function to fetch emails
//   (async()=>{
//     await fetchEmails()
//     res.send("Done");
//   })();
try {
    const allMails = await fetchEmails();
    
    console.log(allMails)
    res.json(allMails[0]);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Error fetching emails");
  }
 
};
