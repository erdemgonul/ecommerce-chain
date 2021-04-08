import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'dart:convert' show json, base64, ascii;
import 'baseConfig.dart';
import 'cartItemWidget.dart';
import 'cartProvider.dart';

class CartPage extends StatelessWidget {
  CartPage(this.jwt, this.payload);

  factory CartPage.fromBase64(String jwt) => CartPage(
      jwt,
      json.decode(
          ascii.decode(base64.decode(base64.normalize(jwt.split(".")[1])))));

  final String jwt;
  final Map<String, dynamic> payload;

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
              itemBuilder: (_, index) => CartItemWidget(
                  cart.items.values.toList()[index].id,
                  cart.items.keys.toList()[index],
                  cart.items.values.toList()[index].price,
                  cart.items.values.toList()[index].quantity,
                  cart.items.values.toList()[index].title),
              itemCount: cart.items.length,
            ),
          )
        ],
      )),
    );
  }
}
