import 'package:ecommerce_flutter/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' show json, base64, ascii;

import 'baseConfig.dart';

class CartPage extends StatelessWidget {
  CartPage(this.jwt, this.payload);

  factory CartPage.fromBase64(String jwt) =>
      CartPage(
          jwt,
          json.decode(
              ascii.decode(
                  base64.decode(base64.normalize(jwt.split(".")[1]))
              )
          )
      );

  final String jwt;
  final Map<String, dynamic> payload;

  @override
  Widget build(BuildContext context) =>
      Scaffold(
        appBar: AppBar(title: Text("My Cart")),
        body: Center(
          child: FutureBuilder(
              future: http.read('$SERVER_IP/data', headers: {"Authorization": jwt}),
              builder: (context, snapshot) =>

              snapshot.hasError ?  Container(child:Column(children: <Widget>[
                Text("Logged In")

              ],) ): CircularProgressIndicator()
          ),
        ),
      );
}