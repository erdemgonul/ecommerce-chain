import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:ecommerce_flutter/signup.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'home.dart';
import 'model/user.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class CheckoutPage extends StatefulWidget {
  @override
  _CheckoutPageState createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage>{

  String Address="";
  String phonenumber="";
  String note="";

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent));
    return Scaffold(
      body: Container(
        child: ListView(
          children: <Widget>[
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