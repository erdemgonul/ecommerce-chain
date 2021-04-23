import 'dart:convert';

import 'package:ecommerce_flutter/productCard.dart';
import 'package:ecommerce_flutter/screens/ProductPageScreen/productPage.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'baseConfig.dart';
import 'cartPage.dart';
import 'model/product.dart';
import 'package:http/http.dart' as http;

class SearchPage extends StatefulWidget {
  @override
  SearchPageState createState() => SearchPageState();
}

class SearchPageState extends State<StatefulWidget> {
  List<Product> searchresult = List();
  String key;

  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    Map<String, dynamic> responseJson = json.decode(jwt);
    print("jwt");
    print(jwt);
    return responseJson['accessToken'];
  }

  Future<String> searchProduct(String key) async {
    var jwtToken = await jwtOrEmpty;
    var res = await http.post("$SERVER_IP/api/v1/product/search",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          'Authorization': 'Bearer $jwtToken'
        },
        body: jsonEncode({'query': key, 'fullData': true}));
    if (res.statusCode == 200) {
      print(res.body);
      var noninitializedProductList = json.decode(res.body)['data']['products'];
      print(noninitializedProductList);
      //TODO: var i yapılabilir
      searchresult.clear();
      for (Map<String, dynamic> i in noninitializedProductList) {
        searchresult.add(Product.fromJson(i));
      }
      print(searchresult.length);
      return res.body; //can be null since will not be used
    }
    return null;
  }

  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent));
    return FutureBuilder<String>(
        future: searchProduct(key),
        builder: (context, AsyncSnapshot<String> snapshot) => Scaffold(
            appBar: AppBar(
                title: TextFormField(
                  style: TextStyle(color: Colors.black87),
                  //TODO: carry this to search button listener for less server load
                  onChanged: (value) {
                    setState(() {
                      key = value;
                      //print(searchresult.length);
                    });
                  },
                  decoration: InputDecoration(
                    hintText: "Search",
                    border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
                    hintStyle: TextStyle(color: Colors.black87),
                  ),
                ),

                actions: [
                  IconButton(
                      icon: Icon(Icons.search),
                      onPressed: () {}),
                ]),
            body: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: GridView.builder(
                          itemCount: searchresult.length,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 20,
                            crossAxisSpacing: 20,
                            childAspectRatio: 0.75,
                          ),
                          itemBuilder: (context, index) => ProductCard(
                            product: searchresult.elementAt(index),
                            press: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => DetailsScreen(
                                    product: searchresult.elementAt(index),
                                  ),
                                )),
                          )),
                    ),
                  ),
                ])));
  }
}