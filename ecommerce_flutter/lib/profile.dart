import 'dart:convert';
import 'package:ecommerce_flutter/changePassword.dart';
import 'package:ecommerce_flutter/progress.dart';
import 'package:http/http.dart' as http;

import "package:flutter/material.dart";

import 'baseConfig.dart';
import 'login.dart';
import 'model/user.dart';

class ProfilePage extends StatefulWidget {
  ProfilePage(this.jwt, this.payload);

  factory ProfilePage.fromBase64(String jwt) => ProfilePage(
      jwt,
      json.decode(
          ascii.decode(base64.decode(base64.normalize(jwt.split(".")[1])))));

  final String jwt;
  final Map<String, dynamic> payload;
  @override
  _EditProfileState createState() => _EditProfileState();


}

class _EditProfileState extends State<ProfilePage> {
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
    print("jwt");
    print(jwt);
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
    print("deneme");
    print(a);
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
    return res.statusCode;
  }
  Future<int> setUserData() async {
    final myJsonAsString = '{}';
    final reqBody = json.decode(myJsonAsString);

    if(userData.email != emailController.text){
      reqBody["email"]=emailController.text;
    }
    if(userData.username != usernameController.text){
      reqBody["username"]=usernameController.text;
    }
    if(userData.firstName != firstNameController.text){
      reqBody["firstName"]=firstNameController.text;
    }
    if(userData.lastName != lastNameController.text){
      reqBody["lastName"]=lastNameController.text;
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
                ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Colors.blue)),
                  onPressed: setUserData,
                  child: Text(
                    "Update My Informations"
                  ),
                ),
                ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Colors.blue)),
                  onPressed: () =>  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ChangePasswordPage()
                      )
                  ),
                  child: Text(
                    "Change My Password",

                  ),
                ),
                ElevatedButton(
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                            Colors.blue)),
                    onPressed: () async {
                      storage.deleteAll();
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => LoginPage()));
                    },
                    child: Text("Çıkış Yap"))
              ],
            ),
          ),
        ],
      ),
    );
  }
}