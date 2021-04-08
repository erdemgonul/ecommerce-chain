import 'package:flutter/cupertino.dart';

class User {
  String username;
  String email;
  String firstName;
  String lastName;
  String role;

  User({
    @required this.username,
    @required this.email,
    @required this.firstName,
    @required this.lastName,
    this.role
  });

  User.fromJson(Map<String, dynamic> json)
      : username = json['username'],
        email = json['email'],
        firstName = json['firstName'],
        lastName= json['lastName'],
        role = json['role'];

  Map<String, dynamic> toJson() =>
      {
        'username': username,
        'email': email,
        'firstName':firstName,
        'lastName' : lastName,
        'role':role
      };
}