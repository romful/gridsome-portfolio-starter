const Hubspot = require('hubspot')
exports.handler = async function(event, context, callback) {
	const dealsData = JSON.parse(event.body)
	const hubspot = new Hubspot({
		apiKey: process.env.HUBSPOT_API_KEY
	})
	await hubspot.contacts.getByEmail(dealsData.email)
	.then( async data => { 
		const opts = {}
		await hubspot.deals.getAssociated('contact', data.vid, opts)
		.then(data => { 
			return {
				statusCode: 200,
				body: JSON.stringify(data)
			}
		})
		.catch( async (err) => {
			return {
				statusCode: err.code,
				body: JSON.stringify({ msg: err.message })
			}
		})
	})
	.catch( async (err) => {
		return {
			statusCode: err.code,
			body: JSON.stringify({ msg: err.message })
		}
	})
}
