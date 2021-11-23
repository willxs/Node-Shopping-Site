var mongoose = require("mongoose");

var discountSchema = mongoose.Schema({
  code: {
    type: String,
  },
  description: {
    type: String,
  },
  percentage: {
    type: Number,
  },
});

var Discount = (module.exports = mongoose.model("Discount", discountSchema));

module.exports.getAllDiscounts = function (callback) {
  Discount.find(callback);
};

module.exports.getDiscountByCode = function (discountCode, callback) {
  var query = { code: discountCode };
  Discount.findOne(query, callback);
};
