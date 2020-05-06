			var url = "https://api.hsforms.com/submissions/v3/integration/submit/7568331/a3a3813d-79b6-4819-ae74-f82372d68398";
			var response = await fetch(url, {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
{
	"fields": [{
		"name": "email",
		"value": "smsreferat@gmail.com"
	}, {
		"name": "firstname",
		"value": "First Name"
	}, {
		"name": "lastname",
		"value": "Last Name"
	}, {
		"name": "message",
		"value": "Test Message"
	}]
}),
			});
			var json = await response.json();
			if(json.inlineMessage) {
				console.log(json.inlineMessage);
			}else if(json.errors && json.errors[0] && json.errors[0].message){
				console.log(json.errors[0].message);
			}else if(json.message){
				console.log(json.message);
			}else{
				console.log("ERROR!!!");
			}
