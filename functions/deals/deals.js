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
				status: 200,
				statusText: 'OK',
				data: JSON.stringify(data)
			}
		})
		.catch( async (err) => {
			return {
				status: err.code,
				statusText: err.message
			}
		})
	})
	.catch( async (err) => {
		return {
			status: err.code,
			statusText: err.message
		}
	})
}
