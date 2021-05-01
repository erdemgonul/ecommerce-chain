import 'dart:convert';
import 'package:ecommerce_flutter/UITemplates.dart';
import 'package:http/http.dart' as http;

import 'package:ecommerce_flutter/signup.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'cartItemWidget.dart';
import 'cartPage.dart';
import 'cartProvider.dart';
import 'home.dart';
import 'model/user.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class CheckoutPage extends StatefulWidget {
  Cart cart;
  CheckoutPage(this.cart);


  @override
  _CheckoutPageState createState() => _CheckoutPageState(this.cart);
}

class _CheckoutPageState extends State<CheckoutPage>{
  String Address="";
  String phonenumber="";
  String note="";
  Cart cart;

  _CheckoutPageState(this.cart);

  double cartSum(Cart cart) {
    var sum = 0.0;
    var list = cart.items.values.toList();
    for (var product in list) {
      sum += product.price * product.quantity;
    }
    return sum;
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent));
    return Scaffold(
      body: Container(
        child: ListView(
          children: <Widget>[
            UITemplates().topBar("Checkout", null),
            //TODO: add products in cart in here
            Text("Total:" + cartSum(cart).toString()),
            formSection()
          ],
        ),
      ),
    );
  }

  Container formSection() {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 15.0, vertical: 20.0),
        child: Form(
          child: Column(
            children: <Widget>[
              TextFormField(
                style: TextStyle(color: Colors.black87),
                onChanged: (value) {
                  setState(() {
                    Address = value;
                  });
                },
                decoration: InputDecoration(
                  icon: Icon(Icons.email, color: Colors.black87),
                  hintText: "Address",
                  border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
                  hintStyle: TextStyle(color: Colors.black87),
                ),
              ),
              SizedBox(height: 30.0),
              TextFormField(
                style: TextStyle(color: Colors.black87),
                obscureText: true,
                onChanged: (value) {
                  setState(() {
                    phonenumber = value;
                  });
                },
                decoration: InputDecoration(
                  icon: Icon(Icons.lock, color: Colors.black87),
                  hintText: "Phone Number",
                  border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
                  hintStyle: TextStyle(color: Colors.black87),
                ),
              ),
              TextFormField(
                style: TextStyle(color: Colors.black87),
                obscureText: true,
                onChanged: (value) {
                  setState(() {
                    note = value;
                  });
                },
                decoration: InputDecoration(
                  icon: Icon(Icons.lock, color: Colors.black87),
                  hintText: "Additional notes",
                  border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
                  hintStyle: TextStyle(color: Colors.black87),
                ),
              ),
              //switchSection(),
              //buttonSection()
            ],
          ),
        ));
  }
  
}