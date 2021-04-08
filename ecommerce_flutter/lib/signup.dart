import 'dart:async';
import 'dart:io';

import 'package:ecommerce_flutter/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' show ascii, base64, json, jsonEncode;

const SERVER_IP = 'http://10.0.2.2:5000';
final storage = FlutterSecureStorage();

class Signup extends StatefulWidget {

  @override
  _Signup createState() => _Signup();
}

class _Signup extends State<Signup> {

  bool _isLoading = false;
  bool _rememberMe= false;
  String email="";
  String password="";
  String userName="";
  String firstName="";
  String lastName="";


  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    if(jwt == null) return "";
    return jwt;
  }

  Future<int> attemptSignUp() async {
    var res = await http.post(
        '$SERVER_IP/api/v1/auth/signup',
        body: jsonEncode({
          "userName": userName,
          "password": password,
          "firstName": firstName,
          "lastName": lastName,
          "email":email
        }),headers: { "accept": "application/json", "content-type": "application/json" }
    );

    print(userName);
    return res.statusCode;
  }
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
                email = value;
              });
            },
            decoration: InputDecoration(
              icon: Icon(Icons.email, color: Colors.black87),
              hintText: "Email",
              border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
              hintStyle: TextStyle(color: Colors.black87),
            ),
          ),
        TextFormField(
          style: TextStyle(color: Colors.black87),
          onChanged: (value) {
            setState(() {
              userName = value;
            });
          },
          decoration: InputDecoration(
            icon: Icon(Icons.account_circle, color: Colors.black87),
            hintText: "Username",
            border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
            hintStyle: TextStyle(color: Colors.black87),
          ),
        ),
        TextFormField(
          style: TextStyle(color: Colors.black87),
          onChanged: (value) {
            setState(() {
              firstName = value;
            });
          },
          decoration: InputDecoration(
            icon: Icon(Icons.person, color: Colors.black87),
            hintText: "First Name",
            border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black87)),
            hintStyle: TextStyle(color: Colors.black87),
          ),
        ),
        TextFormField(
          style: TextStyle(color: Colors.black87),
          onChanged: (value) {
            setState(() {
              lastName = value;
            });
          },
          decoration: InputDecoration(
            icon: Icon(Icons.person, color: Colors.black87),
            hintText: "Last Name",
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
            obscureText: true,
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
  void displayDialog(context, title, text) => showDialog(
    context: context,
    builder: (context) =>
        AlertDialog(
            title: Text(title),
            content: Text(text)
        ),
  );
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
        onPressed: email == "" || password == "" ? null : () async {
            if(userName.length < 4)
              displayDialog(context, "Invalid Username", "The username should be at least 4 characters long");
            else if(password.length < 4)
              displayDialog(context, "Invalid Password", "The password should be at least 4 characters long");
            else{
    var res = await attemptSignUp();
    if(res == 200){
    displayDialog(context, "Success", "The user was created. Log in now.");
    Timer(Duration(seconds: 5), () {
      // 5s over, navigate to a new page
      Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()));
    });

    }
              else if(res == 409)
                displayDialog(context, "That username is already registered", "Please try to sign up using another username or log in if you already have an account.");
              else {
                displayDialog(context, "Error", "An unknown error occurred.");
              }
            }
        },
        child: Text("Sign Up", style: TextStyle(color: Colors.white)),
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
              MaterialPageRoute(builder: (context) => LoginPage()));
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
      child: Text("Sign Up",
          style: TextStyle(
              color: Colors.black,
              fontSize: 40.0,
              fontWeight: FontWeight.bold)),
    );
  }
}