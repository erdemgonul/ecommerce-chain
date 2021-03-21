import 'package:ecommerce_flutter/signup.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  bool _isLoading = false;
  bool _rememberMe= false;
  String email="";
  String password="";

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
        onPressed: email == "" || password == "" ? null : () {
          setState(() {
            _isLoading = true;
          });
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