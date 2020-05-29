const Hubspot = require('hubspot')

exports.handler = async function(event, context, callback) {
  console.log(event.body)
  alert(event.body)
  const { senderEmail } = JSON.parse(event.body)
  const hubspot = new Hubspot({
    apiKey: process.env.HUBSPOT_API_KEY
  })
  console.log("start hubspot contact...", process.env.HUBSPOT_API_KEY)
  ///
  await hubspot.contacts.getByEmail(senderEmail)
  .then( async data => { 
    console.log('CONTACT EXISTS')
    const payload = { 
      'engagement': { 
        'active': true, 
        'ownerId': 1, 
        'type': 'EMAIL', 
        'timestamp': Date.now() 
      }, 
      'associations': { 
        'contactIds': [data.vid], 
        'companyIds': [ ], 
        'dealIds': [ ], 
        'ownerIds': [ ] 
      },
      'metadata': {
        "from": 
          {
            "email": senderEmail,
//            "firstName": senderFirstName,
//            "lastName": senderLastName,
          },
        "to": [{ "email": "bot11x11 <procom@mail.ru>" }],
        "subject": "New Form Submission",
        "text": senderEmail
      }
    }
    await hubspot.engagements.create(payload)
    .then( async data => { 
      console.log("ENGAGEMENT CREATED")
      const dealProperties = [
        {
          value: senderEmail,
          name: 'dealname',
        },
        {
          value: 'appointmentscheduled',
          name: 'dealstage',
        },
        {
          value: 'default',
          name: 'pipeline',
        },
        {
          value: 'newbusiness',
          name: 'dealtype',
        },
      ]
      await hubspot.deals.create({associations: { associatedVids: [ data.vid ] }, properties: dealProperties})
      .then(data => { 
        console.log("ENGAGEMENT + DEAL CREATED")
        return {
          statusCode: 200,
          body: "ENGAGEMENT + DEAL CREATED",
        }
      })
    })
  })
  .catch( async (e) => {
    console.log("CONTACT DOES NOT EXIST")
    const contactObj = {
      "properties": [
//        { "property": "firstname","value": senderFirstName },
//        { "property": "lastname", "value": senderLastName },
        { "property": "email", "value": senderEmail },
//        { "property": "company", "value": senderCompany },
      ]
    }
    await hubspot.contacts.create(contactObj)
    .then( async data => { 
      console.log("NEW CONTACT ADDED")
      const payload = { 
        'engagement': { 
          'active': true, 
          'ownerId': 1, 
          'type': 'EMAIL', 
          'timestamp': Date.now() 
        }, 
        'associations': { 
          'contactIds': [data.vid], 
          'companyIds': [ ], 
          'dealIds': [ ], 
          'ownerIds': [ ] 
        },
        'metadata': {
          "from": 
            {
              "email": senderEmail,
//              "firstName": senderFirstName,
//              "lastName": senderLastName,
            },
          "to": [{ "email": "bot11x11 <procom@mail.ru>" }],
          "subject": "New Form Submission",
          "text": message
        }
      }
      await hubspot.engagements.create(payload)
      .then( async data => { 
        console.log("ENGAGEMENT CREATED")
        const dealProperties = [
          {
            value: senderEmail,
            name: 'dealname',
          },
          {
            value: 'appointmentscheduled',
            name: 'dealstage',
          },
          {
            value: 'default',
            name: 'pipeline',
          },
          {
            value: 'newbusiness',
            name: 'dealtype',
          },
        ]
        await hubspot.deals.create({associations: { associatedVids: [ data.vid ] }, properties: dealProperties})
        .then(data => { 
          console.log("DEAL CREATED")
          return {
            statusCode: 200,
            body: "CONTACT + ENGAGEMENT + DEAL CREATED",
          }
        })
      })
      .catch( (err) => {
        console.log("ERROR 456", err.message)
        return {
          statusCode: err.code,
          body: JSON.stringify({ msg: err.message })
        }
      })
    })
    .catch( (err) => {
      console.log("ERROR 233", err.message)
      return {
        statusCode: err.code,
        body: JSON.stringify({ msg: err.message })
      }
    })
  })
  ///
}