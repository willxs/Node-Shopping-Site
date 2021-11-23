module.exports = class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.discountPrice = oldCart.discountPrice || 0;
    this.userId = oldCart.userId || "";
  }

  add(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += parseFloat(storedItem.item.price.toFixed(2));
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  decreaseQty(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.items[id].price = parseFloat(this.items[id].price.toFixed(2));
    this.totalQty--;
    this.totalPrice -= parseFloat(this.items[id].item.price.toFixed(2));
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  }

  increaseQty(id) {
    this.items[id].qty++;
    this.items[id].price += this.items[id].item.price;
    this.items[id].price = parseFloat(this.items[id].price.toFixed(2));
    this.totalQty++;
    this.totalPrice += parseFloat(this.items[id].item.price.toFixed(2));
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  generateArray() {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
};
