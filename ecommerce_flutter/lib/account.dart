import 'dart:convert';
import 'package:ecommerce_flutter/progress.dart';
import 'package:http/http.dart' as http;

import "package:flutter/material.dart";

import 'baseConfig.dart';
import 'model/user.dart';

class AccountPage extends StatefulWidget {
  AccountPage(this.jwt, this.payload);

  factory AccountPage.fromBase64(String jwt) => AccountPage(
      jwt,
      json.decode(
          ascii.decode(base64.decode(base64.normalize(jwt.split(".")[1])))));

  final String jwt;
  final Map<String, dynamic> payload;
  @override
  _EditProfileState createState() => _EditProfileState();


}

class _EditProfileState extends State<AccountPage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  TextEditingController displayNameController = TextEditingController();
  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

  bool isLoading = false;
  bool _displayNameValid = true;
  bool _bioValid = true;
  User userData;
  String username;
  String jwt;
  @override
  void initState() {
    super.initState();
    getUserData();
    print("asdasdas");
  }
  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    Map<String, dynamic> responseJson = json.decode(jwt);

    return responseJson['accessToken'];
  }
  Future<int> getUserData() async {
    var jwtToken=await jwtOrEmpty;
    var res = await http.post(
        '$SERVER_IP/api/v1/user/get/details',
        headers: { "accept": "application/json", "content-type": "application/json",  'Authorization': 'Bearer $jwtToken'}
    );
    print(res.body);

    Map a=json.decode(res.body)['data'];
    var user = User.fromJson(a);
    this.setState(() {
      userData=user;
    });
    displayNameController.text = user.firstName + " " + user.lastName;
    firstNameController.text = user.firstName;
    lastNameController.text = user.lastName;
    usernameController.text = user.username;
    emailController.text = user.email;


    username=user.firstName + " " + user.lastName;
    print(userData.firstName);
    return res.statusCode;
  }
  Future<int> setUserData() async {

    userData.email=emailController.text;
    userData.username=usernameController.text;
    userData.firstName=firstNameController.text;
    userData.lastName=lastNameController.text;

    var jwtToken=await jwtOrEmpty;
    var res = await http.post(
        '$SERVER_IP/api/v1/user/change/details',
        body: jsonEncode(userData),
        headers: { "accept": "application/json", "content-type": "application/json",  'Authorization': 'Bearer $jwtToken'}
    );
    print(res.body);

    String a=json.decode(res.body)['success'];
    if(a==true){
      print("başarılı");
    }else{
      print("başarısız");
    }

    return res.statusCode;
  }
  Column buildDisplayName() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              (username!= null) ? username : "",
              style: TextStyle(fontSize: 24)

            ))
      ],
    );
  }
  Column buildUsernameField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Username:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: usernameController,
          decoration: InputDecoration(
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildEmailField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Email:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: emailController,
          decoration: InputDecoration(
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildFirstNameField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
             "First Name:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: firstNameController,
          decoration: InputDecoration(
            hintText: "Update Display Name",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildLastNameField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Last Name:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: lastNameController,
          decoration: InputDecoration(
            hintText: "Update Display Name",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildPasswordField() {
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
         enabled: false,

          decoration: InputDecoration(
            hintText: "***********",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  updateProfileData() {
    setState(() {

    });


  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(title: Text("My Profile"),
      actions: <Widget>[
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: Icon(
              Icons.done,
              size: 30.0,
              color: Colors.green,
            ),
          ),
        ],
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
                      buildUsernameField(),
                      buildPasswordField(),
                      buildEmailField(),
                      buildFirstNameField(),
                      buildLastNameField(),
                    ],
                  ),
                ),
                RaisedButton(
                  onPressed: setUserData,
                  child: Text(
                    "Update My Informations",
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                RaisedButton(
                  onPressed: setUserData,
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