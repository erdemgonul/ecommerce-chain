import 'package:ecommerce_flutter/model/product.dart';
import 'package:ecommerce_flutter/screens/ProductPageScreen/productPageTitle.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../cartProvider.dart';


class Body extends StatelessWidget {
  final Product product;
  void displayDialog(context, title, text) => showDialog(
    context: context,
    builder: (context) =>
        AlertDialog(
            title: Text(title),
            content: Text(text)
        ),
  );
  const Body({Key key, this.product}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          SizedBox(
            height: size.height,
            child: Stack(
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(top: size.height * 0.3),
                  padding: EdgeInsets.only(
                    top: size.height * 0.12,
                    left: 20,
                    right: 20,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(24),
                      topRight: Radius.circular(24),
                    ),
                  ),
                  child: Column(
                    children: <Widget>[

                      SizedBox(height: 10),
                      Text(
                        product.description,
                        style: TextStyle(height: 1.5),
                      ),
                      SizedBox(height: 10),
                      SizedBox(height: 10),
                      SizedBox(
                        height: 50,
                        child: FlatButton(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18)),
                          color: product.color,
                          onPressed: () { final cart = Provider.of<Cart>(context,listen: false);
                          cart.addItem(product);
                          displayDialog(context, "Product added to cart", "successful");

                          },
                          child: Text(
                            "Add To Cart".toUpperCase(),
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                ProductTitleWithImage(product: product)
              ],
            ),
          )
        ],
      ),
    );
  }
}