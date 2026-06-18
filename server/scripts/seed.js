require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Company = require("../models/Company");
const Branch = require("../models/Branch");
const Category = require("../models/Category");
const SparePart = require("../models/SpareParts");


const RESET = true;


// ================= COMPANIES =================


const COMPANIES = [

{
name:"Nairobi Motor Hub Ltd",
email:"info@nairomotorhub.co.ke",
phone:"+254722345678",
address:"Enterprise Road, Industrial Area Nairobi",

admin:{
name:"James Mwangi",
email:"admin@nairomotorhub.co.ke",
password:"MotorHub@2026"
},


users:[

{
name:"Mary Wanjiku",
email:"manager@nairomotorhub.co.ke",
password:"Manager@2026",
role:"branch-manager"
},

{
name:"Kevin Otieno",
email:"cashier@nairomotorhub.co.ke",
password:"Cashier@2026",
role:"cashier"
},

{
name:"Samuel Kariuki",
email:"store@nairomotorhub.co.ke",
password:"Store@2026",
role:"storekeeper"
}

],


branches:[

{
name:"Industrial Area Branch",
address:"Enterprise Road Nairobi",
phone:"+254722345679",
isMainBranch:true
},

{
name:"Thika Road Branch",
address:"TRM Drive Nairobi",
phone:"+254722345680"
}

]

},



{
name:"Coastline Auto Parts Kenya",
email:"info@coastlineautoparts.co.ke",
phone:"+254733456789",
address:"Nkrumah Road Mombasa",


admin:{
name:"Amina Hassan",
email:"admin@coastlineautoparts.co.ke",
password:"CoastAuto@2026"
},


users:[

{
name:"Fatuma Ali",
email:"manager@coastlineautoparts.co.ke",
password:"Manager@2026",
role:"branch-manager"
},

{
name:"Brian Mwangi",
email:"cashier@coastlineautoparts.co.ke",
password:"Cashier@2026",
role:"cashier"
},

{
name:"Ali Hassan",
email:"store@coastlineautoparts.co.ke",
password:"Store@2026",
role:"storekeeper"
}

],


branches:[

{
name:"Mombasa Main Branch",
address:"Nkrumah Road Mombasa",
phone:"+254733456790",
isMainBranch:true
},

{
name:"Nyali Branch",
address:"Links Road Nyali",
phone:"+254733456791"
}

]

}

];



// ================= PARTS =================


const INVENTORY = {


Engine:[

["Engine Oil Filter","EOF-001","Bosch",50,500,850],
["Spark Plug Set","SP-004","NGK",40,1200,1800],
["Timing Belt","TB-010","Gates",25,2500,4000],
["Engine Mount","EM-100","Toyota",20,3500,5500],
["Cylinder Head Gasket","CHG-200","Victor",15,4500,7000]

],


Brakes:[

["Front Brake Pads","BP-F01","Brembo",40,2000,3500],
["Rear Brake Pads","BP-R01","TRW",35,1800,3200],
["Brake Disc","BD-100","Bosch",20,5000,7500],
["Brake Drum","BD-200","TRW",15,4500,6500],
["Brake Fluid","BF-001","Castrol",60,600,1200]

],


Electrical:[

["Car Battery 70Ah","BAT-70","Chloride",30,9000,13000],
["Alternator","ALT-90","Denso",10,15000,22000],
["Starter Motor","STM-10","Bosch",12,12000,18000],
["Headlight Bulb","HL-001","Osram",100,300,800],
["Ignition Coil","IC-001","Denso",25,2500,4500]

],


Suspension:[

["Shock Absorber Front","SH-F01","KYB",30,4000,6500],
["Shock Absorber Rear","SH-R01","KYB",25,3500,6000],
["Control Arm","CA-001","Toyota",20,5000,8000],
["Ball Joint","BJ-001","555",40,1500,2800],
["Coil Spring","CS-001","Lesjofors",15,3000,5000]

],


Filters:[

["Air Filter","AF-001","Mann",60,500,900],
["Cabin Filter","CF-001","Mahle",50,700,1200],
["Fuel Filter","FF-001","Bosch",45,800,1500],
["Transmission Filter","TF-001","Toyota",20,2500,4000],
["Oil Filter Heavy Duty","OF-001","Donaldson",35,900,1600]

],


Cooling:[

["Radiator","RAD-001","Toyota",15,12000,18000],
["Radiator Fan","RF-001","Denso",20,4000,7000],
["Water Pump","WP-001","Gates",25,3500,6000],
["Thermostat","TH-001","Toyota",40,1000,2000],
["Radiator Hose","RH-001","Gates",50,600,1200]

]

};


const CATEGORIES = Object.keys(INVENTORY);



// ================= FUNCTIONS =================


async function resetData(companyName){

if(!RESET) return;


const company =
await Company.findOne({
name:companyName
});


if(!company) return;


const branches =
await Branch.find({
company:company._id
});


const ids =
branches.map(b=>b._id);



await SparePart.deleteMany({
branch:{
$in:ids
}
});


await Category.deleteMany({
branch:{
$in:ids
}
});


await User.deleteMany({
company:company._id
});


await Branch.deleteMany({
company:company._id
});


await Company.deleteOne({
_id:company._id
});


}



async function createInventory(branch){


for(const categoryName of CATEGORIES){


const category =
await Category.create({

name:categoryName,

branch:branch._id

});


for(const p of INVENTORY[categoryName]){


await SparePart.create({

description:p[0],
part_no:p[1],
brand:p[2],
qty:p[3],
buying_price:p[4],
selling_price:p[5],

category:category._id,

branch:branch._id,

compatible_models:[
"Toyota Corolla",
"Toyota Vitz"
]

});


}


}

}




async function createUser(company,branches,data){


return await User.create({

name:data.name,

email:data.email,

password:data.password,

role:data.role,

company:company._id,

branches:
branches.map(b=>b._id),

branch:branches[0]._id,

activeBranch:branches[0]._id

});


}



// ================= RUN =================


(async()=>{


try{


await connectDB();


for(const c of COMPANIES){


await resetData(c.name);



const company =
await Company.create(c);



const branches=[];


for(const b of c.branches){


branches.push(

await Branch.create({

...b,

company:company._id,

isActive:true

})

);


}




const admin =
await User.create({

name:c.admin.name,

email:c.admin.email,

password:c.admin.password,

role:"admin",

company:company._id,

branches:branches.map(b=>b._id),

branch:branches[0]._id,

activeBranch:branches[0]._id

});



console.log(
"\nADMIN LOGIN:",
admin.email,
"/",
c.admin.password
);



for(const u of c.users){


const user =
await createUser(
company,
branches,
u
);


console.log(
"USER:",
user.email,
"/",
u.password
);


}



for(const branch of branches){


await createInventory(branch);


console.log(
"Inventory created:",
branch.name
);


}


}



console.log(
"\nSEED COMPLETED"
);


process.exit();


}
catch(err){


console.error(
err
);


process.exit(1);


}


})();