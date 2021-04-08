import 'dart:async';
import 'dart:convert';
import 'package:ecommerce_flutter/login.dart';
import 'package:ecommerce_flutter/progress.dart';
import 'package:http/http.dart' as http;

import "package:flutter/material.dart";

import 'baseConfig.dart';
import 'model/user.dart';

class ChangePasswordPage extends StatefulWidget {
  ChangePasswordPage();

  @override
  _ChangePasswordPage createState() => _ChangePasswordPage();
}

class _ChangePasswordPage extends State<ChangePasswordPage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  TextEditingController oldPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController repeatPasswordController = TextEditingController();

  bool isLoading = false;
  bool _displayNameValid = true;
  String jwt;
  @override
  void initState() {
    super.initState();
  }
  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    Map<String, dynamic> responseJson = json.decode(jwt);

    return responseJson['accessToken'];
  }

  Future<int> changePassword() async {
    final myJsonAsString = '{}';
    final reqBody = json.decode(myJsonAsString);

    /*if(oldPasswordController.text.length>6){
      reqBody["oldPassword"]=oldPasswordController.text;
    }*/
    if(repeatPasswordController.text == newPasswordController.text){
      reqBody["password"]=newPasswordController.text;
    }

    var jwtToken=await jwtOrEmpty;
    var res = await http.post(
        '$SERVER_IP/api/v1/user/change/details',
        body: jsonEncode(reqBody),
        headers: { "accept": "application/json", "content-type": "application/json",  'Authorization': 'Bearer $jwtToken'}
    );

    var a=json.decode(res.body)['success'];
    if(a==true){
      print("başarılı");

      displayDialog(context, "Success", "The user was created. Log in now.");
      Timer(Duration(seconds: 5), () {
        // 5s over, navigate to a new page
        Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => LoginPage()));
      });
    }else{
      print("başarısız");
    }

    return res.statusCode;
  }
  void displayDialog(context, title, text) => showDialog(
    context: context,
    builder: (context) =>
        AlertDialog(
            title: Text(title),
            content: Text(text)
        ),
  );
  Column buildDisplayName() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Change Password",
              style: TextStyle(fontSize: 24)

            ))
      ],
    );
  }

  Column buildOldPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Password:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          obscureText: true,
          controller: oldPasswordController,
          decoration: InputDecoration(
            hintText: "***********",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildNewPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Password:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          obscureText: true,
          controller: newPasswordController,
          decoration: InputDecoration(
            hintText: "***********",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildRepeatPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Password:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          obscureText: true,
          controller: repeatPasswordController,
          decoration: InputDecoration(
            hintText: "***********",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(title: Text("Password Change"),
     
      ),
      body: isLoading
          ? circularProgress()
          : ListView(
        children: <Widget>[
          Container(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.only(
                    top: 16.0,
                    bottom: 8.0,
                  ),

                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: <Widget>[
                      buildDisplayName(),
                      buildOldPasswordField(),
                      buildNewPasswordField(),
                      buildRepeatPasswordField(),
                    ],
                  ),
                ),
                RaisedButton(
                  onPressed: changePassword,
                  child: Text(
                    "Change My Password",
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}