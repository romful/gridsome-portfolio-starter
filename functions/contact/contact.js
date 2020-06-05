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
          value: Date.parse(orderData.datetime.substr(0, 10)),
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
    await hubspot.deals.create({associations: { associatedVids: [ data.vid ] }, properties: dealProperties})
    .then(data => { 
      console.log("DEAL CREATED")
      return {
        statusCode: 200,
        body: "DEAL CREATED",
      }
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
      await hubspot.deals.create({associations: { associatedVids: [ data.vid ] }, properties: dealProperties})
      .then(data => { 
        console.log("DEAL CREATED")
        return {
          statusCode: 200,
          body: "CONTACT + DEAL CREATED",
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
