import 'package:ecommerce_flutter/screens/ProductPageScreen/productPageBody.dart';
import 'package:flutter/material.dart';

import '../../model/product.dart';

class DetailsScreen extends StatelessWidget {
  final Product product;

  const DetailsScreen({Key key, this.product}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // each product have a color
      backgroundColor: Colors.white,
      appBar: buildAppBar(context),
      body: Body(product: product),
    );
  }

  AppBar buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.blueAccent,
      elevation: 0,
      actions: <Widget>[



      ],
    );
  }
}