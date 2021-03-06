var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var Variant = require("../models/variant");
var Discount = require("../models/discount");
var Department = require("../models/department");
var Category = require("../models/categories");
var User = require("../models/user");
var Order = require("../models/order");

router.get("/", ensureAuthenticated, ensureAdmin, function (req, res, next) {
  res.render("dashboard", { title: "Dashboard" });
});

router.get(
  "/inventory",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Product.getAllProducts(function (e, products) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("inventory", { title: "Inventory", products: products });
      }
    });
  }
);

router.get(
  "/insert-inventory",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Department.getAllDepartments(function (e, departments) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/update')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("insertInventory", {
          title: "Insert Inventory",
          departments: departments,
        });
      }
    });
  }
);

router.post(
  "/insert-inventory",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let sizes = req.body.size ? req.body.size.toString() : "";
    let department = req.body.department ? req.body.department.toString() : "";
    let category = req.body.category ? req.body.category.toString() : "";
    let title = toTitleCase(req.body.title);

    let product = new Product({
      imagePath: req.body.imagePath,
      title: title,
      description: req.body.description,
      price: req.body.price,
      color: req.body.color,
      size: sizes,
      quantity: req.body.quantity,
      department: department,
      category: category,
    });
    product.save();
    req.flash("success_msg", "A new product successfully added to database");
    res.redirect("/dashboard/inventory");
  }
);

router.get(
  "/update-inventory/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let productId = req.params.id;
    Product.findOne({ _id: productId }, function (e, item) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/update')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        Variant.getVariantProductByID(productId, function (e, variants) {
          Department.getAllDepartments(function (e, departments) {
            res.render("updateProduct", {
              title: "Update product",
              product: item,
              variants: variants,
              departments: departments,
            });
          });
        });
      }
    });
  }
);

router.post(
  "/update-inventory/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let productId = req.params.id;
    let sizes = req.body.size ? req.body.size.toString() : "";
    let department = req.body.department ? req.body.department.toString() : "";
    let category = req.body.category ? req.body.category.toString() : "";
    let title = toTitleCase(req.body.title);

    Product.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          imagePath: req.body.imagePath,
          title: title,
          description: req.body.description,
          price: req.body.price,
          color: req.body.color,
          size: sizes,
          quantity: req.body.quantity,
          department: department,
          category: category,
        },
      },
      { new: true },
      function (e, result) {
        if (e) {
          console.log(
            "Failed on router.post('/dashboard/update-inventory/')\nError:"
              .error,
            e.message.error + "\n"
          );
          e.status = 406;
          next(e);
        } else {
          req.flash("success_msg", "Product updated!");
          res.redirect("/dashboard/inventory");
        }
      }
    );
  }
);

router.get(
  "/delete-inventory/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let productId = req.params.id;
    Variant.find({ productID: productId }, function (e, variants) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/delete-variant')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        for (let i = variants.length - 1; i > -1; i--) {
          Variant.deleteOne({ _id: variants[i]._id }, function (e, result) {
            if (e) {
              console.log(
                "Failed on router.get('/dashboard/delete-variant')\nError:"
                  .error,
                e.message.error + "\n"
              );
              e.status = 406;
              next(e);
            }
          });
        }
        Product.deleteOne({ _id: productId }, function (e, result) {
          if (e) {
            console.log(
              "Failed on router.get('/delete')\nError:".error,
              e.message.error + "\n"
            );
            e.status = 406;
            next(e);
          } else {
            req.flash(
              "success_msg",
              "A product successfully deleted from database"
            );
            res.redirect("/dashboard/inventory");
          }
        });
      }
    });
  }
);

router.get(
  "/add-variant/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let productId = req.params.id;
    Product.findById(productId, function (e, product) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/add-variant')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        Variant.getVariantProductByID(productId, function (e, variants) {
          if (e) {
            console.log(
              "Failed on router.get('/dashboard/update')\nError:".error,
              e.message.error + "\n"
            );
            e.status = 406;
            next(e);
          } else {
            res.render("insertVariant", {
              title: "Add Variant",
              product: product,
              variants: variants,
            });
          }
        });
      }
    });
  }
);

router.post(
  "/add-variant/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let productID = req.params.id;
    let sizes = req.body.size ? req.body.size.toString() : "";

    let variant = new Variant({
      productID: productID,
      imagePath: req.body.imagePath,
      color: req.body.color,
      size: sizes,
      quantity: req.body.quantity,
    });
    variant.save();
    req.flash("success_msg", "A new variant successfully added to product");
    res.redirect("/dashboard/inventory");
  }
);

router.get(
  "/update-variant/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let variantId = req.params.id;
    Variant.findOne({ _id: variantId }, function (e, variant) {
      if (e) {
        console.log(
          "Failed on router.get('/update-variant/:id')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        Product.findOne({ _id: variant.productID }, function (e, product) {
          if (e) {
            console.log(
              "Failed on router.get('/update-variant/:id') product findOne\nError:"
                .error,
              e.message.error + "\n"
            );
            e.status = 406;
            next(e);
          } else {
            res.render("updateVariant", {
              title: "Update variant",
              variant: variant,
              product: product,
            });
          }
        });
      }
    });
  }
);

router.post(
  "/update-variant/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let variantID = req.params.id;
    let sizes = req.body.size ? req.body.size.toString() : "";

    Variant.findOneAndUpdate(
      { _id: variantID },
      {
        $set: {
          imagePath: req.body.imagePath,
          color: req.body.color,
          size: sizes,
          quantity: req.body.quantity,
        },
      },
      { new: true },
      function (e, result) {
        if (e) {
          console.log(
            "Failed on router.get('/update-variant/:id')\nError:".error,
            e.message.error + "\n"
          );
          e.status = 406;
          next(e);
        } else {
          req.flash("success_msg", "Variant updated!");
          res.redirect("/dashboard/inventory");
        }
      }
    );
  }
);

router.get(
  "/delete-variant/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let variantId = req.params.id;
    Variant.deleteOne({ _id: variantId }, function (e, result) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/delete-variant')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        req.flash(
          "success_msg",
          "A variant successfully deleted from database"
        );
        res.redirect("/dashboard/inventory");
      }
    });
  }
);

router.get(
  "/departments",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Department.getAllDepartments(function (e, departments) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("departments", {
          title: "Departments",
          departments: departments,
        });
      }
    });
  }
);

router.get(
  "/insert-department",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Category.getAllCategories(function (e, categories) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("insertDepartment", {
          title: "Insert Department",
          categories: categories,
        });
      }
    });
  }
);

router.post(
  "/insert-department",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let name = toTitleCase(req.body.departmentName);
    let department = new Department({
      departmentName: name,
      categories: req.body.categoryName,
    });
    department.save();
    req.flash("success_msg", "New department successfully added to database");
    res.redirect("/dashboard/departments");
  }
);

router.get(
  "/update-department/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let departmentID = req.params.id;
    Department.findOne({ _id: departmentID }, function (e, department) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/update-department')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        Category.getAllCategories(function (e, categories) {
          if (e) {
            console.log(
              "Failed on router.get('/inventory')\nError:".error,
              e.message.error + "\n"
            );
            e.status = 406;
            next(e);
          } else {
            res.render("updateDepartment", {
              title: "Update department",
              department: department,
              categories: categories,
            });
          }
        });
      }
    });
  }
);

router.post(
  "/update-department/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let departmentID = req.params.id;
    var departmentName = toTitleCase(req.body.departmentName);

    Department.getDepartmentById(departmentID, function (e, department) {
      var oldDepartmentName = department.departmentName;
      Product.getAllProducts(function (e, products) {
        for (let x = 0; x < products.length; x++) {
          if (products[x].department.includes(oldDepartmentName)) {
            Product.findOneAndUpdate(
              { _id: products[x]._id },
              {
                $set: {
                  department: departmentName,
                },
              },
              { new: true },
              function (e, result) {
                console.log("department updated in product");
              }
            );
          }
        }
        Department.findOneAndUpdate(
          { _id: departmentID },
          {
            $set: {
              departmentName: departmentName,
              categories: req.body.categoryName,
            },
          },
          { new: true },
          function (e, result) {
            req.flash("success_msg", "Department updated!");
            res.redirect("/dashboard/departments");
          }
        );
      });
    });
  }
);

router.get(
  "/delete-department/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let departmentID = req.params.id;
    Department.getDepartmentById(departmentID, function (e, department) {
      var oldDepartmentName = department.departmentName;
      Product.getAllProducts(function (e, products) {
        for (let x = 0; x < products.length; x++) {
          if (products[x].department.includes(oldDepartmentName)) {
            console.log("This product includes same category");
            console.log("product: ", products[x]);
            Product.findOneAndUpdate(
              { _id: products[x]._id },
              {
                $set: {
                  department: "",
                  category: "",
                },
              },
              { new: true },
              function (e, result) {
                console.log("department deleted in product");
              }
            );
          }
        }
        Department.deleteOne({ _id: departmentID }, function (e, result) {
          req.flash(
            "success_msg",
            "A department successfully deleted from database"
          );
          res.redirect("/dashboard/departments");
        });
      });
    });
  }
);

router.get(
  "/categories",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Category.getAllCategories(function (e, categories) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("categories", {
          title: "Categories",
          categories: categories,
        });
      }
    });
  }
);

router.get(
  "/insert-category",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res) {
    res.render("insertCategory", { title: "Insert Category" });
  }
);

router.post(
  "/insert-category",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    var category = new Category({
      categoryName: toTitleCase(req.body.categoryName),
    });
    category.save();
    req.flash("success_msg", "New category successfully added to database");
    res.redirect("/dashboard/categories");
  }
);

router.get(
  "/update-category/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let categoryID = req.params.id;
    Category.findOne({ _id: categoryID }, function (e, category) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/update-category')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("updateCategory", {
          title: "Update category",
          category: category,
        });
      }
    });
  }
);

router.post(
  "/update-category/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let categoryID = req.params.id;
    var categoryName = toTitleCase(req.body.categoryName);

    Category.getCategoryById(categoryID, function (e, category) {
      oldCategoryName = category.categoryName;
      Department.getAllDepartments(function (e, departments) {
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].categories.includes(oldCategoryName)) {
            var array = departments[i].categories.split(",");
            var index = array.indexOf(oldCategoryName);
            array[index] = categoryName;
            array = array.toString();
            Department.findOneAndUpdate(
              { _id: departments[i]._id },
              {
                $set: {
                  categories: array,
                },
              },
              { new: true },
              function (e, result) {
                console.log("category deleted from department");
              }
            );
          }
        }
        Product.getAllProducts(function (e, products) {
          for (let x = 0; x < products.length; x++) {
            if (products[x].category.includes(oldCategoryName)) {
              Product.findOneAndUpdate(
                { _id: products[x]._id },
                {
                  $set: {
                    category: categoryName,
                  },
                },
                { new: true },
                function (e, result) {
                  console.log("category deleted from product");
                }
              );
            }
          }
          Category.findOneAndUpdate(
            { _id: categoryID },
            {
              $set: {
                categoryName: categoryName,
              },
            },
            { new: true },
            function (e, result) {
              req.flash("success_msg", "Category updated!");
              res.redirect("/dashboard/categories");
            }
          );
        });
      });
    });
  }
);

router.get(
  "/delete-category/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let categoryID = req.params.id;
    Category.getCategoryById(categoryID, function (e, category) {
      categoryName = category.categoryName;
      Department.getAllDepartments(function (e, departments) {
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].categories.includes(categoryName)) {
            var array = departments[i].categories.split(",");
            var index = array.indexOf(categoryName);
            if (index > -1) {
              array.splice(index, 1);
            }
            array = array.toString();
            Department.findOneAndUpdate(
              { _id: departments[i]._id },
              {
                $set: {
                  departmentName: departments[i].departmentName,
                  categories: array,
                },
              },
              { new: true },
              function (e, result) {
                console.log("category deleted from department");
              }
            );
          }
        }
        Product.getAllProducts(function (e, products) {
          for (let x = 0; x < products.length; x++) {
            if (products[x].category.includes(categoryName)) {
              Product.findOneAndUpdate(
                { _id: products[x]._id },
                {
                  $set: {
                    category: "",
                  },
                },
                { new: true },
                function (e, result) {
                  console.log("category deleted from product");
                }
              );
            }
          }
          Category.deleteOne({ _id: categoryID }, function (e, result) {
            req.flash(
              "success_msg",
              "A category successfully deleted from database"
            );
            res.redirect("/dashboard/categories");
          });
        });
      });
    });
  }
);

router.get(
  "/discount-codes",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Discount.getAllDiscounts(function (e, discounts) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/discount-codes')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("discountCodes", {
          title: "Discount Codes",
          discounts: discounts,
        });
      }
    });
  }
);

router.get(
  "/insert-discount-code",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    res.render("insertDiscountCode", { title: "Insert Inventory" });
  }
);

router.post(
  "/insert-discount-code",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let discount = new Discount({
      code: req.body.code,
      description: req.body.description,
      percentage: req.body.percentage,
    });
    discount.save();
    req.flash(
      "success_msg",
      "New discount code successfully added to database"
    );
    res.redirect("/dashboard/discount-codes");
  }
);

router.get(
  "/delete-discount-code/:id",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    let discountCodeId = req.params.id;
    Discount.deleteOne({ _id: discountCodeId }, function (e, result) {
      if (e) {
        console.log(
          "Failed on router.get('/dashboard/delete-discount-code')\nError:"
            .error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        req.flash(
          "success_msg",
          "A discount code successfully deleted from database"
        );
        res.redirect("/dashboard/discount-codes");
      }
    });
  }
);

router.get(
  "/user-list",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    User.getAllUsers(function (e, users) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("users", { title: "Users", users: users });
      }
    });
  }
);

router.get("/delete-user/:id", ensureAuthenticated, function (req, res, next) {
  let userID = req.params.id;
  User.deleteOne({ _id: userID }, function (e, result) {
    if (e) {
      console.log(
        "Failed on router.get('/dashboard/delete-user')\nError:".error,
        e.message.error + "\n"
      );
      e.status = 406;
      next(e);
    } else {
      req.flash("success_msg", "A user successfully deleted from database");
      res.redirect("/dashboard/user-list");
    }
  });
});

router.get(
  "/sales",
  ensureAuthenticated,
  ensureAdmin,
  function (req, res, next) {
    Order.getAllOrders(function (e, orders) {
      if (e) {
        console.log(
          "Failed on router.get('/inventory')\nError:".error,
          e.message.error + "\n"
        );
        e.status = 406;
        next(e);
      } else {
        res.render("sales", { title: "Sales", sales: orders });
      }
    });
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function (e, departments) {
      req.session.department = JSON.stringify(departments);
      return next();
    });
  } else {
    req.flash("error_msg", "You are not logged in");
    res.redirect("/");
  }
}

function ensureAdmin(req, res, next) {
  if (req.user.admin) {
    return next();
  } else {
    req.flash(
      "error_msg",
      "This page cannot be displayed with your permissions"
    );
    res.redirect("/");
  }
}

function toTitleCase(arg) {
  return arg.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

module.exports = router;
