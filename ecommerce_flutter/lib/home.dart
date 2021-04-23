import 'dart:convert';
import 'package:ecommerce_flutter/model/category.dart';
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

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  HomePage createState() => HomePage();
}

class HomePage extends State<MyHomePage> {
  String jwt;
  Map<String, dynamic> payload;
  Map<String, dynamic> recommendedProductList;
  List<Product> products = List<Product>();
  List<Category> categories;
  Category _selectedCategory;
  List<DropdownMenuItem> categoryDropDown;
  Future categoryFuture;
  Future productFuture;

  HomePage();

  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    Map<String, dynamic> responseJson = json.decode(jwt);
    print("jwt");
    print(jwt);
    return responseJson['accessToken'];
  }

  Future<String> getCategories() async {
    var jwtToken = await jwtOrEmpty;
    var res = await http.post("$SERVER_IP/api/v1/category/get/all", headers: {
      "accept": "application/json",
      "content-type": "application/json",
      'Authorization': 'Bearer $jwtToken'
    });
    if (res.statusCode == 200) {
      categories = List<Category>();
      print(res.body);
      var noninitializedCategoryList =
          json.decode(res.body)['data']['categories'];
      print(noninitializedCategoryList);
      //TODO: var i yapılabilir
      for (Map<String, dynamic> i in noninitializedCategoryList) {
        categories.add(Category.fromJson(i));
      }
      print(categories.length);
      print("eeeee");

      return res.body; //can be null since will not be used
    }
    return null;
  }

  //TODO: Simplify if possible
  Future<String> getSuggestedProducts() async {
    var jwtToken = await jwtOrEmpty;
    var res = await http
        .post("$SERVER_IP/api/v1/product/suggestedproducts", headers: {
      "accept": "application/json",
      "content-type": "application/json",
      'Authorization': 'Bearer $jwtToken'
    });
    if (res.statusCode == 200) {
      products = List<Product>();
      print(res.body);
      var noninitializedProductList = json.decode(res.body)['data']['products'];
      print(noninitializedProductList);
      //TODO: var i yapılabilir
      for (Map<String, dynamic> i in noninitializedProductList) {
        products.add(Product.fromJson(i));
      }
      print(products.length);
      return res.body; //can be null since will not be used
    }
    return null;
  }

  Future<List<Product>> getProductsByCategory(String path) async {
    var jwtToken = await jwtOrEmpty;
    var res = await http.post("$SERVER_IP/api/v1/product/get/category",
        body: jsonEncode({"path": path, "strictMode": false}),
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          'Authorization': 'Bearer $jwtToken'
        });
    if (res.statusCode == 200) {
      var productsA = List<Product>();
      print(res.body);
      var noninitializedProductList = json.decode(res.body)['data']['products'];
      print(noninitializedProductList);
      //TODO: var i yapılabilir
      for (Map<String, dynamic> i in noninitializedProductList) {
        productsA.add(Product.fromJson(i));
      }
      print("NASIL");
      print(productsA.length);

      return productsA; //can be null since will not be used
    }
    print("NEE");
    return null;
  }

  var refreshKey = GlobalKey<RefreshIndicatorState>();

  @override
  void initState() {
    super.initState();
    refreshList();
    categoryFuture = getCategories();
    productFuture = getSuggestedProducts();
  }

  Future<Null> refreshList() async {
    refreshKey.currentState?.show(atTop: false);
    await Future.delayed(Duration(seconds: 2));

    setState(() {
      getSuggestedProducts();
    });

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => SearchPage()));
              })
        ]),
        body: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              FutureBuilder(
                  future: categoryFuture,
                  builder: (BuildContext context, AsyncSnapshot snapshot) {
                    return DropdownButton<Category>(
                        hint: Text("Select item"),
                        value: _selectedCategory,
                        onChanged: (Category Value) async {
                          var a = await getProductsByCategory(Value.path);
                          print(a);
                          setState(() {
                            products = a;
                            _selectedCategory = Value;
                          });
                        },
                        items: categories.map((Category user) {
                          return DropdownMenuItem<Category>(
                            value: user,
                            child: Row(
                              children: <Widget>[
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  user.title,
                                  style: TextStyle(color: Colors.black),
                                ),
                              ],
                            ),
                          );
                        }).toList());
                  }),
              Expanded(
                child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: RefreshIndicator(
                        key: refreshKey,
                        onRefresh: refreshList,
                        child: GridView.builder(
                            itemCount:
                                products != null && products.length != null
                                    ? products.length
                                    : 0,
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
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
                                )))),
              ),
            ]));
  }
}
