import 'dart:convert';
import 'package:ecommerce_flutter/model/product.dart';
import 'package:ecommerce_flutter/productCard.dart';
import 'package:ecommerce_flutter/profile.dart';
import 'package:ecommerce_flutter/screens/ProductPageScreen/productPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'baseConfig.dart';
import 'cartPage.dart';
import 'login.dart';

class HomePage extends StatelessWidget {
  HomePage();



   String jwt;
   Map<String, dynamic> payload;

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text("Home Page"), actions: [
          IconButton(
              icon: Icon(Icons.shopping_cart),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => CartPage(jwt, payload)));
              }),
          IconButton(
              icon: Icon(Icons.account_circle_rounded),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => ProfilePage(jwt, payload)));
              })
        ]),
        body:
       Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: GridView.builder(
                  itemCount: products.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 20,
                    crossAxisSpacing: 20,
                    childAspectRatio: 0.75,
                  ),
                  itemBuilder: (context, index) => ProductCard(
                    product: products[index],
                    press: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => DetailsScreen(
                            product: products[index],
                          ),
                        )),
                  )),
            ),
          ),
    ]
       )
      );
}
