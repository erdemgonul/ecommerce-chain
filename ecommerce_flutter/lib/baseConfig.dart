import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert' show json, base64, ascii;

import 'main.dart';

const SERVER_IP = 'http://10.0.2.2:5000';

// SERVER IP KONTROL ETMEYI UNUTMA
final storage = FlutterSecureStorage();

void main() {
  runApp(MyApp());
}