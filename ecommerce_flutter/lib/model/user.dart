import 'package:flutter/cupertino.dart';

class User {
  String username;
  String email;
  String firstName;
  String lastName;


  User({
    @required this.username,
    @required this.email,
    @required this.firstName,
    @required this.lastName
  });

  User.fromJson(Map<String, dynamic> json)
      : username = json['username'],
        email = json['email'],
        firstName = json['firstName'],
  lastName= json['lastName'];

  Map<String, dynamic> toJson() =>
      {
        'username': username,
        'email': email,
        'firstName':firstName,
        'lastName' : lastName
      };
}