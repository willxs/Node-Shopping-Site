var express = require("express");
var router = express.Router();
var paypal = require("paypal-rest-sdk");
var Cart = require("../models/cart");
var Product = require("../models/product");
var Variant = require("../models/variant");
var Order = require("../models/order");
var Department = require("../models/department");
var Discount = require("../models/discount");

router.get("/", ensureAuthenticated, function (req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;
  res.render("checkout", {
    title: "Checkout Page",
    items: cart.generateArray(),
    totalPrice: parseFloat(cart.totalPrice.toFixed(2)),
    bodyClass: "registration",
    containerWrapper: "container",
  });
});

router.get("/apply-discount", ensureAuthenticated, function (req, res, next) {
  res.redirect("/checkout");
});

router.post("/apply-discount", ensureAuthenticated, function (req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function (e, discount) {
    if (e) {
      console.log(
        "Failed on router.get('/checkout/apply-discount')\nError:".error,
        e.message.error + "\n"
      );
      e.status = 406;
      next(e);
    } else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount =
          (parseFloat(cart.totalPrice.toFixed(2)) * discount.percentage) / 100;
        totalDiscount = parseFloat(totalDiscount.toFixed(2));
        let totalPrice = parseFloat(cart.totalPrice.toFixed(2)) - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2));
        cart.discountPrice = totalPrice;
        req.session.cart = cart;
        console.log(req.session.cart);
        res.render("checkout", {
          title: "Checkout Page",
          items: cart.generateArray(),
          totalPriceAfterDiscount: parseFloat(cart.totalPrice.toFixed(2)),
          totalDiscount: totalDiscount,
          actualPrice: parseFloat(cart.totalPrice.toFixed(2)),
          discountPercentage: discount.percentage,
          bodyClass: "registration",
          containerWrapper: "container",
        });
      } else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        console.log(req.session.cart);
        res.render("checkout", {
          title: "Checkout Page",
          items: cart.generateArray(),
          totalPrice: parseFloat(cart.totalPrice.toFixed(2)),
          discountCode: discountCode,
          bodyClass: "registration",
          containerWrapper: "container",
          msg: "This discount code is not applicable",
        });
      }
    }
  });
});

router.post("/checkout-process", function (req, res) {
  console.log(`ROUTE: POST CHECKOUT-PROGRESS dsdasdas`);
  var cart = new Cart(req.session.cart);
  var totalPrice = parseFloat(cart.totalPrice.toFixed(2));

  var PayPalPaymentJSON = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              price: totalPrice,
              currency: "CAD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "CAD",
          total: totalPrice,
        },
      },
    ],
    redirect_urls: {
      return_url: "http://" + req.headers.host + "/checkout/checkout-success",
      cancel_url: "http://" + req.headers.host + "/checkout/checkout-cancel",
    },
  };

  paypal.payment.create(PayPalPaymentJSON, function (error, paymentInfo) {
    if (error) {
      throw error;
    } else {
      let count = 0;
      while (count < paymentInfo.links.length) {
        if (paymentInfo.links[count].rel === "approval_url") {
          console.log(error);
          paymentTime = paymentInfo.create_time;
          paymentID = paymentInfo.id;
          res.redirect(paymentInfo.links[count].href);
        }
        count++;
      }
    }
  });

  router.get("/checkout-cancel", ensureAuthenticated, function (req, res) {
    res.render("checkoutCancel", {
      title: "Successful",
      containerWrapper: "container",
      userFirstName: req.user.fullname,
    });
  });

  router.get("/checkout-success", ensureAuthenticated, function (req, res) {
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };
    var order;

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
      if (error) {
        console.error(JSON.stringify(error));
      } else {
        if (payment.state === "approved") {
          console.log("order authorization completed successfully");

          var newOrder = new Order({
            orderID: payment.transactions[0].related_resources[0].sale.id,
            username: req.user.username,
            address: "1 Marie-Victorin undefined Toronto Ontario CA M5A 1E1",
            orderDate:
              payment.transactions[0].related_resources[0].sale.create_time,
            shipping: true,
          });
          newOrder.save();
          res.render("checkoutSuccess", {
            title: "Successful",
            containerWrapper: "container",
            userFirstName: req.user.fullname,
          });
        }
      }
    });
  });
});

router.get("/buy-now/:id", ensureAuthenticated, function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function (e, product) {
    if (e) {
      console.log(
        "Failed on router.get('/add-to-bag/:id')\nError:".error,
        e.message.error + "\n"
      );
      e.status = 406;
      next(e);
    } else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render("checkout", {
          title: "Checkout Page",
          items: cart.generateArray(),
          totalPrice: parseFloat(cart.totalPrice.toFixed(2)),
          bodyClass: "registration",
          containerWrapper: "container",
        });
      } else {
        Variant.findById(productId, function (e, variant) {
          if (e) {
            console.log(
              "Failed on router.get('/add-to-bag/:id')\nError:".error,
              e.message.error + "\n"
            );
            e.status = 406;
            next(e);
          } else {
            Product.findById(variant.productID, function (e, p) {
              let color = variant.color ? "- " + variant.color : "";
              variant.title = p.title + " " + color;
              variant.price = p.price;
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render("checkout", {
                title: "Checkout Page",
                items: cart.generateArray(),
                totalPrice: parseFloat(cart.totalPrice.toFixed(2)),
                bodyClass: "registration",
                containerWrapper: "container",
              });
            });
          }
        });
      }
    }
  });
});

function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty);
    Product.getProductByID(item, function (e, p) {
      if (p) {
        Product.findOneAndUpdate(
          {
            _id: item,
          },
          {
            $set: {
              quantity: p.quantity - qty,
            },
          },
          {
            new: true,
          },
          function (e, result) {}
        );
      } else {
        Variant.getVariantByID(item, function (e, v) {
          Variant.findOneAndUpdate(
            {
              _id: item,
            },
            {
              $set: {
                quantity: v.quantity - qty,
              },
            },
            {
              new: true,
            },
            function (e, result) {}
          );
        });
      }
    });
  }

  return callback(true);
}

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

module.exports = router;
