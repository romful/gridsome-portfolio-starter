<template>
	<Layout>
		<div class="container max-w-none overflow-hidden">
			<div class="mx-auto my-10 w-3/3 text-center text-xl font-serif font-bold italic">
				Hello {{ user.given_name || user.name }}, How Can I help you today ?
			</div>
			<div class="mx-auto my-10 w-64 text-center uppercase font-bold">
				{{ now }}
			</div>
			<div class="grid grid-cols-6 gap-4 items-start my-8 mx-auto sm:px-8">
				<div v-for="service in services" class="col-span-6 sm:col-span-6 md:col-span-3 lg:col-span-2 xl:col-span-2">
					<div class="bg-white shadow-lg rounded-lg px-4 py-6 mx-4 my-4">
						<div class="mx-auto h-40 sm:h-64 bg-no-repeat bg-contain bg-bottom rounded-md" :style="{'background-image': 'url(' + service.image + ')' }"></div>
						<div class="w-40 mt-8 block mx-auto text-center font-bold service-title">{{ service.title }}</div>
						<div class="w-64 mt-2 block mx-auto text-center">{{ service.description }}</div>
						<div class="flex justify-center mt-4">
							<button @click="$services.category=service.title; $scrollTo('#services');" class="text-white font-bold py-2 px-4 rounded service-btn">
								Discover
							</button>
						</div>
					</div>
				</div>
			</div>
        			<div id="services" class="flex flex-wrap mb-4 max-w-5xl mx-auto">
				<div class="md:w-1/2 lg:w-1/3 w-full px-2" v-for="edge in $page.allGoogleSheet.edges" v-if="$services.category && edge.node.Category==$services.category">
					<div @click="edge.node.Availability && init(edge.node)" class="mx-auto max-w-sm overflow-hiddenmx-auto cursor-pointer duration-500 transform hover:scale-110">
						<div class="w-full rounded-xl h-64 bg-no-repeat bg-contain bg-bottom" :style="{'background-image': 'url(' + edge.node.Img + ')' }"></div>
						<div class="px-6 pb-4 pt-8 mx-4 -mt-4 mb-4 relative rounded-xl bg-white opacity-75 hover:opacity-100" :class="{'opacity-100': edge.node.Title == orderData.title, 'border-2': edge.node.Title == orderData.title, 'border-blue-500': edge.node.Title == orderData.title}">
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
			<div id="order" v-if="orderData.form">
				<h1 class="font-bold text-xl mb-2 text-center">Fill in the form below and make your request :</h1>
				<h2 class="text-md mb-2 text-center bg-blue-500 text-white rounded-xl py-2 max-w-xs mx-auto">{{ orderData.title }}</h2>
				<form class="mb-8"
					name="order"
					method="post"
					v-on:submit.prevent="handleSubmit"
					action="https://api.hsforms.com/submissions/v3/integration/submit/7568331/a3a3813d-79b6-4819-ae74-f82372d68398">
					<input type="hidden" name="title" v-model="orderData.title" />
					<input type="hidden" name="cost" v-model="orderData.cost" />
					<div class="bg-background-form rounded-xl px-8 pt-6 pb-8 mb-4 w-full max-w-xs mx-auto">
						<div class="mb-4">
							<label class="block text-gray-700 text-sm font-bold mb-2" for="datetime">
								Date &amp; Time
							</label>
							<datepicker
								type="datetime"
								format="D.MM.YY H:mm"
								valueType="YYYY-MM-DD HH:mm"
								:disabled-date="notBeforeToday"
								class="appearance-none w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="datetime"
								name="datetime"
								v-model="orderData.datetime"
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
							<textarea class="appearance-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Specify your request" v-model="orderData.message"></textarea>
						</div>
					</div>
					<div class="text-center mb-4">
						By clicking in the Order button below, you accept the <span class="font-bold">terms and conditions</span> related to this request.<br />
						You will receive an email to approve the request and make the payment and finalise your booking.
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
		<div v-if="orderData.modal" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
			<div @click="toggleModal" class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
			<div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
				<div class="modal-content py-4 text-left px-6">
					<div class="flex justify-between items-center pb-3">
						<p class="text-2xl font-bold text-center">{{ orderData.title }}</p>
						<div @click="toggleModal" class="modal-close cursor-pointer z-50">
							<svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
								<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
							</svg>
						</div>
					</div>
					<div v-html="orderData.description"></div>
					<div class="flex justify-end pt-2">
						<button @click="showForm" class="border-1 text-white border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">Book now</button>
					</div>
				</div>
			</div>
		</div>
		<div v-if="alert" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
			<div @click="toggleAlert" class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
			<div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
				<div class="modal-content py-4 text-left px-6">
					<div class="flex justify-between items-center pb-3">
						<p class="text-2xl font-bold text-center">Booking</p>
						<div @click="toggleAlert" class="modal-close cursor-pointer z-50">
							<svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
								<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
							</svg>
						</div>
					</div>
					<p>{{ alert }}</p>
					<div class="flex justify-end pt-2">
						<button @click="toggleAlert" class="border-1 text-white border-green-700 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">Close</button>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
<script>
import Datepicker from 'vue2-datepicker'
import axios from 'axios'
export default{
	components: {
		Datepicker
	},
	metaInfo: {
		title: 'Order'
	},
	mounted() {
		this.user = this.$auth.user || {};
		this.orderData.email = this.user.email || this.user.name;
	},
	computed: {
		now(){
			let time = new Date();
			return this.dateTimeFormat(time);
		},
		categories(){
			let categories = [];
			this.$page.allGoogleSheet.edges.forEach((edge) => {
				if(!categories.includes(edge.node.Category)){
					categories.push(edge.node.Category);
				}
			});
			return categories;
		}
	},
	data(){
		return{
			alert: false,
			modalActive: false,
			user: {},
			orderData: {
				modal: false,
				form: false,
				title: "",
				description: "",
				datetime: this.today() + " 12:00",
//				date: this.today(),
//				notBefore: new Date(2020, 5, 20),
//				notAfter: new Date(2020, 6, 20),
//				time: "12:00",
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
			},
			services: [{
				title: "Wellness Services",
				description: "Description goes here",
				image: "/wellness.jpg"
			}, {
				title: "Transportation",
				description: "Description goes here",
				image: "/transportation.jpeg"
			}, {
				title: "Activities",
				description: "Description goes here",
				image: "/activity.jpg"
			}, {
				title: "Gastronomy",
				description: "Description goes here",
				image: "/gastronomy.jpg"
			}, {
				title: "Home Services",
				description: "Description goes here",
				image: "/homeservices.jpg"
			}, {
				title: "Local Booking",
				description: "Description goes here",
				image: "/localbooking.jpg"
			}]
		}
	},
	methods: {
		notBeforeToday(date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return date.getTime() < today.getTime();
		},
		toggleModal(){
			this.orderData.modal = !this.orderData.modal;
		},
		toggleAlert(){
			this.alert = "";
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
			this.orderData.modal = true;
			this.orderData.title = data.Title;
			this.orderData.description = data.Description;
			this.orderData.people = 1;
			this.orderData.Up_to_X_pax = data.Up_to_X_pax;
			this.orderData.Price_vat_excluded = data.Price_vat_excluded;
			this.orderData.Price_per_people = data.Price_per_people;
			this.orderData.Price_per_hour = data.Price_per_hour;
		},
		showForm(){
			this.orderData.modal = false;
			this.orderData.form = true;
			this.calc();
			this.$scrollTo("#before-order");
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
		async createDeal() {
			await axios.post('/api/contact', this.orderData)
			.then(data => { 
				console.log(data);
			})
			.catch(async (err) => {
				console.error(err)
			});
		},
		handleSubmit(e) {
			var data = {
				fields: [{
					name: "service_concierge",
					value: this.orderData.title
				}, {
					name: "date_service",
					value: this.orderData.datetime
				}, {
					name: "email",
					value: this.orderData.email
				}, {
					name: "price",
					value: this.orderData.cost
				}]
			};
			this.createDeal();
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
					this.alert = json.inlineMessage;
				}else if(json.errors && json.errors[0] && json.errors[0].message){
					this.alert = json.errors[0].message;
				}else if(json.message){
					this.alert = json.message;
				}else{
					this.alert = "ERROR!!!";
				}
			});
		}
	}
}
</script>
<page-query>
query {
	allGoogleSheet {
		edges {
			node {
				Category
				Featured
				Title
				Description
				Img
				Price_vat_excluded
				Booking_Up_to_X_hours
				Up_to_X_pax
				Price_per_hour
				Price_per_people
				Included
				Availability
			}
		}
	}
}
</page-query>
