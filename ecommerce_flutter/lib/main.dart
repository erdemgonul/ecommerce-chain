import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'authProvider.dart';
import 'baseConfig.dart';
import 'cartProvider.dart';
import 'home.dart';
import 'login.dart';

class MyApp extends StatelessWidget {
  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    if(jwt == null) return "";
    return jwt;
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      // Make the necessary providers available for the app
        providers: [
          ChangeNotifierProvider(create: (_) => Auth()),
          ChangeNotifierProvider(create: (_) => Cart()),

        ], child: Consumer<Auth>(
        builder: (ctx, auth, _) {
          return MaterialApp(
            title: 'Authentication Demo',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            home: FutureBuilder(
                future: jwtOrEmpty,
                builder: (context, snapshot) {
                  if (!snapshot.hasData) return CircularProgressIndicator();
                  if (snapshot.data != "") {
                    var str = snapshot.data;
                    var jwt = str.split(".");

                    if (jwt.length != 3) {
                      return LoginPage();
                    } else {
                      var payload = json.decode(
                          ascii.decode(base64.decode(base64.normalize(
                              jwt[1]))));
                      if (DateTime.fromMillisecondsSinceEpoch(
                          payload["exp"] * 1000).isAfter(DateTime.now())) {
                        return HomePage(str, payload);
                      } else {
                        return LoginPage();
                      }
                    }
                  } else {
                    return LoginPage();
                  }
                }
            ),
          );
        }
    ));
  }
}