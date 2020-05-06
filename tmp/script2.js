			var fields = [{
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
			}];
			var url = "https://api.hsforms.com/submissions/v3/integration/submit/7568331/a3a3813d-79b6-4819-ae74-f82372d68398";
			fetch(url, {
				method: "post",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					"fields": fields
				}),
			})
			.then(response => response.json())
			.then(json => function(){
				if(json.inlineMessage) {
					alert(json.inlineMessage);
				}else if(json.errors && json.errors[0] && json.errors[0].message){
					alert(json.errors[0].message);
				}else if(json.message){
					alert(json.message);
				}else{
					alert("ERROR!!!");
				}
			}).catch(json => function(){
				if(json.inlineMessage) {
					alert(json.inlineMessage);
				}else if(json.errors && json.errors[0] && json.errors[0].message){
					alert(json.errors[0].message);
				}else if(json.message){
					alert(json.message);
				}else{
					alert("ERROR!!!");
				}
			});
