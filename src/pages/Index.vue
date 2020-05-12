<template>
	<Layout>
		<div class="container max-w-none overflow-hidden">
			<div class="mx-auto my-10 w-64 text-center uppercase font-bold">
				{{ now }}
			</div>
			<h1 class="text-center">booking available up to 2 hours before the requested service</h1>
			<div class="mx-auto my-10 relative w-64">
				<select v-model="category" class="block appearance-none w-full border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
					<option value="">-- select the category --</option>
					<option v-for="category in categories">{{ category }}</option>
				</select>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
					<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
				</div>
			</div>
			<div class="flex flex-wrap mb-4 max-w-5xl mx-auto">
				<div class="md:w-1/2 lg:w-1/3 w-full px-2" v-for="edge in $page.allGoogleSheet.edges" v-if="edge.node.Category==category || !category && edge.node.Featured">
					<div class="mx-auto max-w-sm overflow-hiddenmx-auto">
						<div class="w-full rounded-xl h-64 bg-no-repeat bg-contain bg-bottom" :style="{'background-image': 'url(' + edge.node.Img + ')' }"></div>
						<div class="px-6 pb-4 pt-8 mx-4 -mt-4 mb-4 relative rounded-xl cursor-pointer duration-500 bg-white opacity-75 hover:opacity-100 transform hover:scale-110" @click="edge.node.Availability && init(edge.node)" :class="{'opacity-100': edge.node.Title == orderData.title}">
							<div class="font-bold text-xl mb-2">{{ edge.node.Title }}</div>
							<p class="text-gray-700 text-base">
								<span v-if="edge.node.Booking_Up_to_X_hours != ''">Book up to : {{ edge.node.Booking_Up_to_X_hours }} <span v-if="edge.node.Booking_Up_to_X_hours > 1">hours</span><span v-else>hour</span> before<br /></span>
								<span v-if="edge.node.Up_to_X_pax != ''">Up to {{ edge.node.Up_to_X_pax }} <span v-if="edge.node.Up_to_X_pax > 1">people</span><span v-else>person</span><br /></span>
							</p>
							<div class="flex text-sm">
								<div class="w-2/3 font-bold">
									<span v-if="edge.node.Price_vat_excluded">
										Price : {{ edge.node.Price_vat_excluded }} &euro;
										<span v-if="edge.node.Price_per_hour">per hour</span>
										<span v-else-if="edge.node.Price_per_people">per person</span>
									</span>
								</div>
								<div class="w-1/3 font-bold text-right">
									<span v-if="edge.node.Availability" class="text-green-700">Available</span>
									<span v-else class="text-red-700">Unavailable</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="before-order"></div>
			<div id="order" v-if="orderData.title">
				<h1 class="font-bold text-xl mb-2 text-center">Fill in the form below :</h1>
				<h2 class="text-md mb-2 text-center bg-blue-700 text-white rounded-xl py-2 max-w-xs mx-auto">{{ orderData.title }}</h2>
				<form class="mb-8"
					name="order"
					method="post"
					v-on:submit.prevent="handleSubmit"
					action="https://api.hsforms.com/submissions/v3/integration/submit/7568331/a3a3813d-79b6-4819-ae74-f82372d68398">
					<input type="hidden" name="title" v-model="orderData.title" />
					<input type="hidden" name="cost" v-model="orderData.cost" />
					<div class="bg-background-form rounded-xl px-8 pt-6 pb-8 mb-4 w-full max-w-xs mx-auto">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="date">
								Date
							</label>
							<datepicker
								type="date"
								format="D.MM.YY"
								valueType="YYYY-MM-DD"
								:not-before="orderData.notBefore"
								class="appearance-none w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="date"
								name="date"
								v-model="orderData.date"
							></datepicker>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="time">
								Time
							</label>
							<datepicker
								type="time"
								format="H:mm"
								valueType="format"
								class="appearance-none w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="time"
								name="time"
								v-model="orderData.time"
							></datepicker>
						</div>
						<div class="mb-4" v-if="orderData.Price_per_people || orderData.Up_to_X_pax">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="people">
								How many people
							</label>
							<span class="text-center inline-block cursor-pointer w-12 border rounded-l py-2 leading-tight" @click="decrementPeople">-</span>
							<input class="text-center appearance-none w-16 border-t border-b py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="people" type="text" placeholder="Input Number" v-model="orderData.people" />
							<span class="text-center inline-block cursor-pointer w-12 border rounded-r py-2 leading-tight" @click="incrementPeople">+</span>
						</div>
						<div class="mb-4" v-if="orderData.Price_per_hour">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="hours">
								How many hours
							</label>
							<span class="text-center inline-block cursor-pointer w-12 border rounded-l py-2 leading-tight" @click="decrementHours">-</span>
							<input class="text-center appearance-none w-16 border-t border-b py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" type="text" placeholder="Input Number" v-model="orderData.hours" />
							<span class="text-center inline-block cursor-pointer w-12 border rounded-r py-2 leading-tight" @click="incrementHours">+</span>
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="email">
								E-mail
							</label>
							<input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="E-mail" v-model="orderData.email" />
						</div>
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="message">
								Message
							</label>
							<textarea class="appearance-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Input Message" v-model="orderData.message"></textarea>
						</div>
					</div>
					<div class="text-center mb-4">
						By clicking in the Order button below, you accept the <span class="font-bold">terms and conditions</span> related to this request.<br />
						You will receive an email to make the payment and finalise your booking.
					</div>
					<div class="text-center mb-4" v-if="orderData.Price_vat_excluded">
						Total price: <span class="font-bold">{{ orderData.cost }} &euro;</span>
					</div>
					<div class="text-center">
						<button class="border-1 text-white border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
							Order
						</button>
					</div>
				</form>
			</div>
		</div>
	</Layout>
</template>
<script>
import services from '../components/services'
import Datepicker from 'vue2-datepicker'
export default{
	components: {
		Datepicker
	},
	metaInfo: {
		title: 'Order'
	},
	computed: {
		now(){
			let time = new Date();
			return this.dateTimeFormat(time);
		},
		categories(){
			let categories = [];
			services.$static.allGoogleSheet.edges.forEach((edge) => {
				if(!categories.includes(edge.node.Category)){
					categories.push(edge.node.Category);
				}
			});
			return categories;
		}
	},
	data(){
		return{
			category: "",
			orderData: {
				title: "",
				date: this.today(),
				notBefore: "2020-05-06",
				time: "12:00",
				people: 1,
				hours: 1,
				Up_to_X_pax: 0,
				Booking_Up_to_X_hours: 0,
				message: "",
				email: "",
				Price_vat_excluded: 0,
				Price_per_people: 0,
				Price_per_hour: 0,
				cost: 0
			}
		}
	},
	methods: {
		login() {
			this.$auth.loginWithRedirect();
		},
		logout() {
			this.$auth.logout({
				returnTo: window.location.origin
			});
		},
		dateFormat(date){
			var MM, DD, YYYY;
			var dtf = new Intl.DateTimeFormat('en', {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			});
			[{ value: MM },,{ value: DD },,{ value: YYYY }] = dtf.formatToParts(date);
			return `${YYYY}-${MM}-${DD}`;
		},
		dateTimeFormat(date){
			var weekday, month, day, hour, minute;
			var dtf = new Intl.DateTimeFormat('en', {
				weekday: "short",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: false
			});
			[{ value: weekday },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dtf.formatToParts(date);
			day += this.nth(day);
			return `${weekday} ${day} ${month} - ${hour}:${minute}`;
		},
		nth(n){
			return["st","nd","rd"][((n+90)%100-10)%10-1]||"th";
		},
		today(){
			var today = new Date();
			return this.dateFormat(today)
		},
		init(data){
			this.orderData.title = data.Title
			this.orderData.people = 1
			this.orderData.Up_to_X_pax = data.Up_to_X_pax
			this.orderData.Price_vat_excluded = data.Price_vat_excluded
			this.orderData.Price_per_people = data.Price_per_people
			this.orderData.Price_per_hour = data.Price_per_hour
			this.calc()
			this.$scrollTo("#before-order")
		},
		calc(){
			this.orderData.cost = this.orderData.Price_vat_excluded
			if(this.orderData.Price_per_people){
				this.orderData.cost *= this.orderData.people
			}
			if(this.orderData.Price_per_hour){
				this.orderData.cost *= this.orderData.hours
			}
		},
		incrementPeople(){
			if(!this.orderData.Up_to_X_pax || this.orderData.people < this.orderData.Up_to_X_pax){
				this.orderData.people++
				this.calc()
			}
		},
		decrementPeople(){
			if(this.orderData.people > 1){
				this.orderData.people--
				this.calc()
			}
		},
		incrementHours(){
			this.orderData.hours++
			this.calc()
		},
		decrementHours(){
			if(this.orderData.hours > 1){
				this.orderData.hours--
				this.calc()
			}
		},
		handleSubmit(e) {
			var data = {
				fields: [{
					name: "service_concierge",
					value: this.orderData.title
				}, {
					name: "date_service",
					value: this.orderData.date
				}, {
					name: "email",
					value: this.orderData.email
				}, {
					name: "price",
					value: this.orderData.cost
				}]
			};
			fetch(e.target.getAttribute('action'), {
				method: e.target.getAttribute('method'),
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			.then((response) => {
				return response.json();
			})
			.then((json) => {
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
		}
	}
}
</script>
