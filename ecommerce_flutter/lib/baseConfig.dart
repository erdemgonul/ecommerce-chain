import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert' show json, base64, ascii;

import 'main.dart';

<<<<<<< HEAD
const SERVER_IP = 'http://10.0.2.2:5000';
=======
const SERVER_IP = 'http://192.168.31.170:5000';
>>>>>>> 5d9bfaa93d9455599fc56ce0a437fae571ee6e4a

// SERVER IP KONTROL ETMEYI UNUTMA
final storage = FlutterSecureStorage();

void main() {
  runApp(MyApp());
}