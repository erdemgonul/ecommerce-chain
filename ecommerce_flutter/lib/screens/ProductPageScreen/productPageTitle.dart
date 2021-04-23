import 'dart:convert';
import 'package:ecommerce_flutter/model/product.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../cartProvider.dart';

class ProductTitleWithImage extends StatelessWidget {
  const ProductTitleWithImage({
    Key key,
    @required this.product,
  }) : super(key: key);

  final Product product;
  void displayDialog(context, title, text) => showDialog(
    context: context,
    builder: (context) =>
        AlertDialog(
            title: Text(title),
            content: Text(text)
        ),
  );
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20,vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            product.title,
            style: Theme.of(context)
                .textTheme
                .headline4
                .copyWith(color: Colors.black54, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 20),
          Row(
            children: <Widget>[

              Expanded(
                child: Hero(
                  tag: "${product.sku}",
                  child: product.image.length > 30 ? Image.memory(base64Decode(product.image)) : Image.asset("assets/images/bag_3.png")
                ),
              )
            ],
          ),
          Row(
            children: <Widget>[
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(text: "Price\n"),
                    TextSpan(
                      text: "\$${product.price}",
                      style: Theme.of(context).textTheme.headline4.copyWith(
                          color: Colors.black54, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              )

            ],
          ),
          Padding(padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
          )),
          Row(
            children: <Widget>[
              Text(
                "Description: " + product.description,
                style: Theme.of(context)
                    .textTheme
                    .bodyText1
                    .copyWith(color: Colors.black54, fontWeight: FontWeight.normal),
              )
            ],
          ),
          Padding(padding: EdgeInsets.only(
          top: 100,
            left: 20,
            right: 20,
          ),),
          Row(
            children: <Widget>[
              SizedBox(
                height: 50,
                child: FlatButton(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18)),
                  color: Colors.greenAccent,
                  onPressed: () { final cart = Provider.of<Cart>(context,listen: false);
                  cart.addItem(product);
                  displayDialog(context, "Product added to cart", "successful");

                  },
                  child: Text(
                    "Add To Cart".toUpperCase(),
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}