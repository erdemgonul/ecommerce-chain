import 'package:flutter/material.dart';

class Product {
   String sku, image, title, description;
   int price, size, quantity;
   Color color;
   Map<String,dynamic> shipping_details;
   Map<String,dynamic> product_details;
  Product({
    this.sku,
    this.image,
    this.title,
    this.price,
    this.description,
    this.size,
    this.color,
    this.quantity,
    this.product_details,
    this.shipping_details,
  });

   Product.fromJson(Map<String, dynamic> json)
       : sku = json['sku'],
         image = json['image'],
         title = json['title'],
         price= json['price'],
         description = json['description'],
         size = json['size'],
         color= json['color'],
         quantity = json['quantity'],
         product_details = json['product_details'],
         shipping_details = json['shipping_details'];

   Map<String, dynamic> toJson() =>
       {
         'sku': sku,
         'image': image,
         'title':title,
         'price' : price,
         'description':description,
         'size':size,
         'color' : color,
         'quantity' :quantity,
         'product_details':product_details,
         'shipping_details':shipping_details
       };
}

String dummyText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. When an unknown printer took a galley.";