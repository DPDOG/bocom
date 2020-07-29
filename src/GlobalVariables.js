export class GlobalVariables {
     static orders = [];
     static cards = [];
     static slides = [];
     static orderServer = [];
     static dressings={id:null,name:"",image:null};
     static extraDressings={id:null,name:"",image:null,price:0};
     static totalOrders={value:0};
     static userId={value:""};
     static userLanguage={value:"en-US"};
     static restId = {value:""};
     static restCurrencyCode = {value:""};
     static restName = {value:""};
     static tableNumber = {value:""};
     static checkedInLocation = {value:""};
     static email = {value:""};
     static clickedOrder = {value:0};
     static CheckIn =[];
     static loggedAccountType = { value: ""};//0-Normal Login, 1-FB Login,2-Google Login
     static shareUrl = "https://play.google.com/store/apps/details?id=com.bob.v1";
     //static _URL = "http://192.168.5.49:8181";
     static _URL = "http://13.90.156.180";
     //static _URL = "http://192.168.5.49:54167";
     //static _URL = "http://192.168.5.49:44344";
     static TEST_CHECK_IN_ENABLED = false;
     static locationDiscount = {value:""};
     static taxRate = {value:""};
     static checkedInLocation = {lat:"",long:""};
     static DISTANCE_FROM_CHECKED_IN_LOCATION = 100; // If User moves 100 metres away from the location
     static TIME_INTERVAL_FOR_LOCATION_TIMER = 60000; //One minute as requested by client in SOW
}
