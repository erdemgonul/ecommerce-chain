import 'dart:convert';
import 'package:ecommerce_flutter/model/product.dart';
import 'package:ecommerce_flutter/productCard.dart';
import 'package:ecommerce_flutter/profile.dart';
import 'package:ecommerce_flutter/screens/ProductPageScreen/productPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'Search.dart';
import 'baseConfig.dart';
import 'cartPage.dart';
import 'login.dart';

class HomePage extends StatelessWidget {
  String jwt;
  Map<String, dynamic> payload;
  Map<String, dynamic> recommendedProductList;
  List<Product> products = List<Product>();

  HomePage();

  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    Map<String, dynamic> responseJson = json.decode(jwt);
    print("jwt");
    print(jwt);
    return responseJson['accessToken'];
  }

    //TODO: Simplify if possible
    Future<String> getSuggestedProducts() async {
    var jwtToken = await jwtOrEmpty;
    var res = await http.post(
        "$SERVER_IP/api/v1/product/suggestedproducts",
        headers: { "accept": "application/json", "content-type": "application/json", 'Authorization': 'Bearer $jwtToken' }
    );
    if(res.statusCode == 200) {
      print(res.body);
      var noninitializedProductList = json.decode(res.body)['data']['products'];
      print(noninitializedProductList);
      //TODO: var i yapılabilir
      for(Map<String,dynamic> i in noninitializedProductList){
          products.add(Product.fromJson(i));
      }
      print(products.length);
      return res.body; //can be null since will not be used
    }
    return null;

  }


  @override
  Widget build(BuildContext context){
    return FutureBuilder<String>(
      future: getSuggestedProducts(),
      builder: (context, AsyncSnapshot<String> snapshot) => Scaffold(
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
              }),
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => SearchPage())
              );
            }
          )
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
                    product: products.elementAt(index),
                    press: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => DetailsScreen(
                            product: products.elementAt(index),
                          ),
                        )),
                  )),
            ),
          ),
    ]
       )
      ));
}}
