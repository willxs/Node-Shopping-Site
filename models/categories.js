var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    index: true,
  },
});

var Category = (module.exports = mongoose.model("Categories", categorySchema));

module.exports.getAllCategories = function (callback) {
  Category.find(callback);
};

module.exports.getCategoryById = function (id, callback) {
  Category.findById(id, callback);
};
