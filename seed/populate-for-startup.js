var User = require("../models/user");
var Category = require("../models/categories");
var Department = require("../models/department");
var Product = require("../models/product");
var Variant = require("../models/variant");
var mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost/shoppingApp');
//mongoose.connect('mongodb://localhost/myShoppingApp3', { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connect("mongodb://localhost/myShoppingApp3");

var categories = [
  new Category({
    categoryName: "Parkas",
  }),
  new Category({
    categoryName: "Bombers",
  }),
  new Category({
    categoryName: "Hats",
  }),
  new Category({
    categoryName: "Vests",
  }),
  new Category({
    categoryName: "Light Jackets",
  }),
];

for (let i = 0; i < categories.length; i++) {
  categories[i].save(function (e, r) {
    if (i === categories.length - 1) {
      exit();
    }
  });
}

var departments = [
  new Department({
    departmentName: "Women",
    categories: "Parkas,Bombers",
  }),
  new Department({
    departmentName: "Men",
    categories: "Hats,Vests,Light Jackets",
  }),
];

for (let i = 0; i < departments.length; i++) {
  departments[i].save(function (e, r) {
    if (i === departments.length - 1) {
      exit();
    }
  });
}

var products = [
  new Product({
    _id: "5bedf31cc14d7822b39d9d43",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2574L_646.jpg",
    title: "Elrose Parka",
    description:
      "This distinct, full-length parka promises protection and unrivaled style. Topped with a removable hood, it has a sleek design that is equally functional and sophisticated. Interior backpack straps allow you to carry the jacket over your shoulder when things heat up.",
    price: 1350.99,
    color: "Admiral Blue",
    size: "XS,S,M,L,XL",
    quantity: 10,
    department: "Women",
    category: "Parkas",
  }),
  new Product({
    _id: "5bedf3b9c14d7822b39d9d45",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5803L_61.jpg",
    title: "Olympia Parka",
    description:
      "The Olympia Parka is a nod to traditional military-style silhouettes that borrows functional details, like the split hood from pilot jackets. Made from our durable Arctic Tech® fabric, the down-filled hood can be unzipped for added visibility when not in use or done up when the weather calls for it. It's outfitted with a drop-down flap with reflective details for adventures after dusk.",
    price: 995.99,
    color: "Black",
    size: "XS,S,XL",
    quantity: 15,
    department: "Women",
    category: "Parkas",
  }),
  new Product({
    _id: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_11.jpg",
    title: "Gabriola Parka",
    description:
      "The Gabriola Parka will see you through winter's coldest days with a removable hood that works hard to keep you warm in challenging environments and recessed rib knit cuffs to trap heat. It's finished with a hide-away reflective flap at the back for added visibility in low light conditions",
    price: 850.99,
    color: "Red",
    size: "XS",
    quantity: 90,
    department: "Women",
    category: "Parkas",
  }),
  new Product({
    _id: "5bedf55bc14d7822b39d9d4b",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_1333/product-image/7900LB_510.jpg",
    title: "Savona Bomber Black Label",
    description:
      "Featuring nods to our classic bomber styles, this cozy winter essential is updated with city-ready details for day-to-day urban life. An oversized collar and removable hood provide protection from biting winds.",
    price: 895.99,
    color: "Black Classic Camo",
    size: "S,M,L",
    quantity: 4,
    department: "Women",
    category: "Bombers",
  }),
  new Product({
    _id: "5bedf5eec14d7822b39d9d4e",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5187M_11.jpg",
    title: "Aviator Hat",
    description:
      "Comfort is one of the key elements of the aviator hat. The adjustable chin buckle, the duck down insulation and the water-resistant shell will keep you warm and dry all winter long.",
    price: 350.99,
    color: "Red",
    size: "M,L",
    quantity: 5,
    department: "Men",
    category: "Hats",
  }),
  new Product({
    _id: "5bedf6b5c14d7822b39d9d51",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/4154M_11.jpg",
    title: "Freestyle Crew Vest",
    description:
      "This exceptional, down-filled vest is the ultimate layering piece that can be worn across all seasons. Remastered with a slimmer, more contemporary fit and a longer back hem, our Freestyle Crew offers warmth and versatility. The rounded collar is lined with sumptuously soft suede tricot for additional comfort.",
    price: 450.99,
    color: "Red",
    size: "M,L",
    quantity: 80,
    department: "Men",
    category: "Vests",
  }),
  new Product({
    _id: "5bedf720c14d7822b39d9d52",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2702M_706.jpg",
    title: "Hybridge Lite Vest",
    description:
      "Lightweight but delivering core warmth, the HyBridge® Lite Vest is perfect for layering for outdoor activities during the colder winter months and also as a solitary piece during the shoulder seasons. Following the snug fit form of the collection, it is an essential active-wear item.",
    price: 450.99,
    color: "Admiral Blue",
    size: "XS,S,M",
    quantity: 8,
    department: "Men",
    category: "Vests",
  }),
  new Product({
    _id: "5bedf7ecc14d7822b39d9d55",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/6934M_699.jpg",
    title: "Windbridge Full Zip Sweater",
    description:
      "Innovation meets classic style in this refined silhouette. Ultra-fine Merino wool is paired with durable, wind-resistant fabric in this full-zip design. Thermal Mapping® technology across the upper back helps to promote temperature moderation and airflow in targeted areas.",
    price: 595.99,
    color: "Iron Grey",
    size: "XS,M,XL",
    quantity: 12,
    department: "Men",
    category: "Light Jackets",
  }),

  new Product({
    _id: "5bedf7ecc14d7822b39d9d0A",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5804L_49.jpg",
    title: "Blakely Parka",
    description:
      "Our Blakely Parka is both practical and stylish in equal measure. It's cut at hip-length with a subtle drop back hem and features a removable, diamond quilted hood for days that demand extra protection from the cold. A brushed tricot-lined chin guard is soft against the skin and ribbed knit cuffs work hard to keep the heat in.",
    price: 795.99,
    color: "Military Green",
    size: "XS,M,XL",
    quantity: 12,
    department: "Women",
    category: "Parkas",
  }),

  new Product({
    _id: "5bedf7ecc14d7822b39d9d0B",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_1333/product-image/2090L_11.jpg",
    title: "Lorette Parka",
    description:
      "Conquer fluctuating temperatures in style with a sophisticated parka with elaborate quilt-through detailing. Tighten the adjustable drawcord hood to keep brisk winds out.",
    price: 995.99,
    color: "Red",
    size: "XS,M,XL",
    quantity: 12,
    department: "Women",
    category: "Parkas",
  }),
];

for (let i = 0; i < products.length; i++) {
  products[i].save(function (e, r) {
    if (i === products.length - 1) {
      exit();
    }
  });
}

var variants = [
  new Variant({
    productID: "5bedf31cc14d7822b39d9d43",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2574L_66.jpg",
    color: "Graphite",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf31cc14d7822b39d9d43",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2574L_200.jpg",
    color: "Silverbirch",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf31cc14d7822b39d9d43",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2574L_317.jpg",
    color: "Bordeaux",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf31cc14d7822b39d9d43",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2574L_61.jpg",
    color: "Black",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),

  new Variant({
    productID: "5bedf3b9c14d7822b39d9d45",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5803L_316.jpg",
    color: "Cammo",
    size: "XS,S,M,L,XL",
    quantity: 12,
  }),
  new Variant({
    productID: "5bedf3b9c14d7822b39d9d45",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5803L_49.jpg",
    color: "Military Green",
    size: "XS,S,M,L,XL",
    quantity: 12,
  }),
  new Variant({
    productID: "5bedf3b9c14d7822b39d9d45",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5803L_646.jpg",
    color: "Admiral Blue",
    size: "XS,S,M,L,XL",
    quantity: 12,
  }),

  new Variant({
    productID: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_61.jpg",
    color: "Black",
    size: "XS,M,L",
    quantity: 4,
  }),
  new Variant({
    productID: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_66.jpg",
    color: "Graphite",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_49.jpg",
    color: "Military Green",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_433.jpg",
    color: "White",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),
  new Variant({
    productID: "5bedf448c14d7822b39d9d47",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5806L_646.jpg",
    color: "Admiral Blue",
    size: "XS,S,M,L,XL",
    quantity: 5,
  }),

  new Variant({
    productID: "5bedf5eec14d7822b39d9d4e",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5187M_61.jpg",
    color: "Black",
    size: "S,XL",
    quantity: 35,
  }),
  new Variant({
    productID: "5bedf5eec14d7822b39d9d4e",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5187M_66.jpg",
    color: "Graphite",
    size: "S,XL",
    quantity: 35,
  }),
  new Variant({
    productID: "5bedf5eec14d7822b39d9d4e",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/5187M_67.jpg",
    color: "Navy",
    size: "S,XL",
    quantity: 35,
  }),

  new Variant({
    productID: "5bedf720c14d7822b39d9d52",
    imagePath:
      "https://images.canadagoose.com/image/upload/c_scale,f_auto,q_auto:best,w_480/product-image/2702M_539.jpg",
    color: "Black",
    size: "M,XL",
    quantity: 5,
  }),
];

for (let i = 0; i < variants.length; i++) {
  variants[i].save(function (e, r) {
    if (i === variants.length - 1) {
      exit();
    }
  });
}

var newUser1 = new User({
  username: "william@admin.com",
  password: "william",
  fullname: "William S",
  admin: true,
});
User.createUser(newUser1, function (err, user) {
  if (err) throw err;
  console.log(user);
});

function exit() {
  mongoose.disconnect();
}
