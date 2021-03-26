import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:ecommerce_flutter/signup.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'home.dart';

class AccountPage extends StatefulWidget {
  AccountPage(this.jwt, this.payload);
  @override
  _AccountPage createState() => _AccountPage();
  factory AccountPage.fromBase64(String jwt) =>
      AccountPage(
          jwt,
          json.decode(
              ascii.decode(
                  base64.decode(base64.normalize(jwt.split(".")[1]))
              )
          )
      );

  final String jwt;
  final Map<String, dynamic> payload;


}

class _AccountPage extends State<AccountPage> {


  bool _isLoading = false;
  bool _rememberMe= false;
  String username="";
  String password="";
  void displayDialog(context, title, text) => showDialog(
    context: context,
    builder: (context) =>
        AlertDialog(
            title: Text(title),
            content: Text(text)
        ),
  );

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent));
    return Scaffold(
      body: Container(
        child: _isLoading ? Center(child: CircularProgressIndicator()) : ListView(
          children: <Widget>[
            headerSection(),
            formSection(),
            routeSignUp()
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
                username = value;
              });
            },
            decoration: InputDecoration(
              icon: Icon(Icons.email, color: Colors.black87),
              hintText: "Email",
              border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
              hintStyle: TextStyle(color: Colors.black87),
            ),
          ),
          SizedBox(height: 30.0),
          TextFormField(
            style: TextStyle(color: Colors.black87),
            onChanged: (value) {
              setState(() {
                password = value;
              });
            },
            decoration: InputDecoration(
              icon: Icon(Icons.lock, color: Colors.black87),
              hintText: "Password",
              border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
              hintStyle: TextStyle(color: Colors.black87),
            ),
          ),
        switchSection(),
        buttonSection()
        ],
      ),
    ));
  }

  Row switchSection(){

    return Row (

        mainAxisAlignment: MainAxisAlignment.end,children : [Text("Remember Me",
        style: TextStyle(
            color: Colors.black87,
            fontSize: 16.0))
      ,Switch(
        value: _rememberMe,
        onChanged: (value) {
          setState(() {
            _rememberMe = value;
          });
        },
        activeTrackColor: Colors.blue,
        activeColor: Colors.blueAccent,
      ),
    ]);
  }
  Container buttonSection() {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 40.0,
      padding: EdgeInsets.symmetric(horizontal: 15.0),
      margin: EdgeInsets.only(top: 15.0),
      child: ElevatedButton(
        style: ButtonStyle(backgroundColor: MaterialStateProperty.all<Color>(Colors.blue) ),
        onPressed: username == "" || password == "" ? null : () async {

        },
        child: Text("Sign In", style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Container routeSignUp() {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 40.0,
      padding: EdgeInsets.symmetric(horizontal: 15.0),
      child:TextButton(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => Signup()));
        },
        child: Text(
          'Dont you have an account? Sign up!',
          style: TextStyle(color: Colors.blueGrey),
        ),
      ),
    );
  }

  Container headerSection() {
    return Container(
      margin: EdgeInsets.only(top: 50.0),
      padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
      child: Text("Sign In",
          style: TextStyle(
              color: Colors.black,
              fontSize: 40.0,
              fontWeight: FontWeight.bold)),
    );
  }
}