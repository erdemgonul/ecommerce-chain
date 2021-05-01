import 'dart:convert';
import 'dart:io';
import 'package:ecommerce_flutter/changePassword.dart';
import 'package:ecommerce_flutter/progress.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import "package:flutter/material.dart";
import 'package:image_picker/image_picker.dart';

import 'baseConfig.dart';
import 'login.dart';
import 'model/product.dart';
import 'model/user.dart';
import 'dart:math';

class CreateProduct extends StatefulWidget {
  CreateProduct();

  @override
  _CreateProductState createState() => _CreateProductState();


}

class _CreateProductState extends State<CreateProduct> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  TextEditingController titleController = TextEditingController();
  TextEditingController priceController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  TextEditingController sizeController = TextEditingController();
  TextEditingController colorController = TextEditingController();

  bool isLoading = false;
  bool _displayNameValid = true;
  bool _bioValid = true;
  User userData;
  Product product= new Product();
  File file;

  String username;
  String jwt;
  @override
  void initState() {
    super.initState();
    getUserData();
    print("asdasdas");
  }

  void _choose() async {
    //file = await ImagePicker.pickImage(source: ImageSource.camera);
    file = await ImagePicker.pickImage(source: ImageSource.gallery);
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
    username=user.firstName + " " + user.lastName;
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

  Future<int> createProductService() async {
    Product product=new Product();
    product.title = titleController.text;
    product.description = descriptionController.text;
    product.price =int.parse(priceController.text);
    product.color = Color((new Random().nextDouble() * 0xFFFFFF).toInt()).withOpacity(1.0);

    product.size = 12;

    //String base64Image = base64Encode(file.readAsBytesSync());
    product.image="data:image/jpeg;base64,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";

    Random random = new Random();
    int randomNumber = random.nextInt(10000);
    product.sku=randomNumber.toString();
    final reqBody = product.toJson();
    reqBody['color']= Color((new Random().nextDouble() * 0xFFFFFF).toInt()).withOpacity(1.0).toString();
    var jwtToken=await jwtOrEmpty;
    var res = await http.post(
        '$SERVER_IP/api/v1/product/create',
        body: jsonEncode(reqBody),
        headers: { "accept": "application/json", "content-type": "application/json",  'Authorization': 'Bearer $jwtToken'}
    );

    var a=json.decode(res.body)['success'];
    if(a==true){
      print("başarılı");
      displayDialog(context, "Product created", "successful");

    }else{
      print("başarısız");
      displayDialog(context, "Error", "error");

    }

    return res.statusCode;
  }


  Column buildDisplayName() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0,bottom:20.0),
            child: Text(
             "Create Product - Admin Page",
              style: TextStyle(fontSize: 24)

            ))
      ],
    );
  }
  Column buildImageUploadField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
    Padding(
    padding: EdgeInsets.only(top: 12.0),
    child:    Row(
    mainAxisAlignment: MainAxisAlignment.start,

    children: <Widget>[
      Text(
        "Product Image:",
        style: TextStyle(color: Colors.black87,fontSize: 16),
      ),
    RaisedButton(
    onPressed: _choose,
    child: Text('Choose Image'),
    ),
    SizedBox(width: 10.0),
    ],
    ),

    )],
    )
    ;
  }
  Column buildTitleField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Product Title:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: titleController,
          decoration: InputDecoration(
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildPriceField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
             "Price:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: priceController,
          keyboardType: TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [BlacklistingTextInputFormatter(new RegExp('[\\-|\\ ]'))],
          decoration: InputDecoration(
            hintText: "25\$",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildDescriptionField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 12.0),
            child: Text(
              "Description:",
              style: TextStyle(color: Colors.grey),
            )),
        TextField(
          controller: descriptionController,
          decoration: InputDecoration(
            hintText: "Product Description",
            errorText: _displayNameValid ? null : "Display Name too short",
          ),
        )
      ],
    );
  }
  Column buildSizeField() {
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
          controller: sizeController,
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
                      buildTitleField(),
                      buildDescriptionField(),
                      buildPriceField(),
                      buildImageUploadField(),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Colors.blue)),
                  onPressed: createProductService,
                  child: Text(
                    "Create Product"
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