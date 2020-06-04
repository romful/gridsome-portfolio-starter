const Hubspot = require('hubspot')

exports.handler = async function(event, context, callback) {
  console.log(event.body)
//  const { senderEmail } = JSON.parse(event.body)
  const orderData = JSON.parse(event.body)
  const hubspot = new Hubspot({
    apiKey: process.env.HUBSPOT_API_KEY
  })
  console.log("start hubspot contact...", process.env.HUBSPOT_API_KEY)
  ///
      const dealProperties = [
        {
          value: orderData.email,
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
        {
          value: Date.parse(orderData.datetime),
          name: 'date_of_service',
        },
        {
          value: orderData.cost,
          name: 'amount',
        }
      ]
  await hubspot.contacts.getByEmail(orderData.email)
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
            "email": orderData.email,
//            "firstName": senderFirstName,
//            "lastName": senderLastName,
          },
        "to": [{ "email": "bot11x11 <procom@mail.ru>" }],
        "subject": "New Form Submission",
        "text": orderData.email
      }
    }
    await hubspot.engagements.create(payload)
    .then( async data => { 
      console.log("ENGAGEMENT CREATED")
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
        { "property": "email", "value": orderData.email },
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
              "email": orderData.email,
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
