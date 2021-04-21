import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'dart:convert' show json, base64, ascii;
import 'baseConfig.dart';
import 'cartItemWidget.dart';
import 'cartProvider.dart';
import 'checkoutPage.dart';

class CartPage extends StatelessWidget {
  CartPage(this.jwt, this.payload);

  factory CartPage.fromBase64(String jwt) =>
      CartPage(
          jwt,
          json.decode(
              ascii.decode(
                  base64.decode(base64.normalize(jwt.split(".")[1])))));

  final String jwt;
  final Map<String, dynamic> payload;

  double cartSum(Cart cart) {
    var sum = 0.0;
    var list = cart.items.values.toList();
    for (var product in list) {
      sum += product.price * product.quantity;
    }
    return sum;
  }

  void displayDialog(context, title, text) =>
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
                title: Text(title),
                content: Text(text)
            ),
      );

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<Cart>(context);
    return Scaffold(
      appBar: AppBar(title: Text("My Cart")),
      body: Center(
          child: Column(
            children: <Widget>[
              Expanded(
                child: ListView.builder(
                  itemBuilder: (_, index) =>
                      CartItemWidget(
                          cart.items.values.toList()[index].id,
                          cart.items.keys.toList()[index],
                          cart.items.values.toList()[index].price,
                          cart.items.values.toList()[index].quantity,
                          cart.items.values.toList()[index].title),
                  itemCount: cart.items.length,
                ),
              ),
              buttonSection(context, cart)
            ],
          )),
    );
  }

  Container buttonSection(BuildContext context, Cart cart) {
    return Container(
      width: MediaQuery
          .of(context)
          .size
          .width,
      height: 40.0,
      padding: EdgeInsets.symmetric(horizontal: 15.0),
      margin: EdgeInsets.only(top: 15.0),
      child: ElevatedButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all<Color>(Colors.blue)),
        onPressed: cart.items.values
            .toList()
            .isEmpty ? null : () async {
          var sum = cartSum(cart);
          print(sum);
          if (sum != 0.0)
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => CheckoutPage()
                )
            );
          else {
            displayDialog(context, "An Error Occurred",
                "No items in cart!");
          }
        },
        child: Text("Checkout", style: TextStyle(color: Colors.white)),
      ),
    );
  }
}